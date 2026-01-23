
/**
 * WEBHOOK PARA CAKTO PAY
 * 
 * Este webhook processa as vendas da Cakto e libera o acesso vitalício no Supabase.
 * 
 * PARA TESTAR MANUALMENTE (Simular venda sem comprar):
 * Cole este comando no seu terminal (substitua URL_DA_FUNCAO pela sua URL do Supabase):
 * 
 * curl -X POST https://URL_DA_FUNCAO/functions/v1/cakto-webhook \
 * -H "Content-Type: application/json" \
 * -d '{
 *   "event": "order.paid",
 *   "customer": { "email": "seu-email-teste@gmail.com", "name": "Teste Webhook" },
 *   "amount": 4700
 * }'
 */

declare const Deno: any;
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const payload = await req.json()
    
    // Cakto pode enviar o evento em diferentes chaves dependendo da versão
    const event = payload.event || payload.status || payload.type;
    
    // Busca e-mail em múltiplos locais possíveis do payload da Cakto
    const email = (
      payload.customer?.email || 
      payload.data?.customer?.email || 
      payload.email || 
      ""
    ).toLowerCase().trim();

    const name = payload.customer?.name || payload.data?.customer?.name || "Membro da Fé";

    console.log(`[Webhook] Evento: ${event} | Email: ${email}`);

    if (!email) {
      return new Response(JSON.stringify({ error: "Email não identificado" }), { status: 400 });
    }

    // Status de sucesso da Cakto (order.paid, paid, completed)
    const successEvents = ['order.paid', 'paid', 'completed', 'approved'];
    const pendingEvents = ['order.created', 'waiting_payment', 'pending'];

    if (successEvents.includes(event)) {
      // LIBERAÇÃO VITALÍCIA
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          email: email,
          display_name: name,
          has_vital_access: true,
          last_purchase_at: new Date().toISOString(),
          cakto_payload: payload 
        }, { onConflict: 'email' });

      if (error) throw error;
      console.log(`✅ ACESSO LIBERADO: ${email}`);
      
      return new Response(JSON.stringify({ success: true, message: "Acesso vitalício liberado" }), { status: 200 });
    } 
    
    if (pendingEvents.includes(event)) {
      // REGISTRO DE LEAD/AGUARDANDO
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          email: email,
          display_name: name,
          has_vital_access: false,
          cakto_payload: payload 
        }, { onConflict: 'email' });
        
      if (error) throw error;
      console.log(`⏳ Pagamento pendente registrado: ${email}`);
      return new Response(JSON.stringify({ success: true, message: "Aguardando pagamento" }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: true, message: "Evento ignorado" }), { status: 200 });

  } catch (err: any) {
    console.error("❌ Erro no Processamento:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
})
