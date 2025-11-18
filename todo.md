# Project TODO - Global Vacation Rental Platform

## 0. Sistema i18n (Multilanguage)
- [x] Sistema de internacionalização com suporte a PT, EN, ES, FR, IT, JP
- [x] Seletor de idioma no header
- [x] Detecção automática de locale do navegador
- [x] Tabela de traduções no banco de dados
- [ ] Traduzir todas as chaves i18n para os 6 idiomas
- [ ] Sistema de fallback para traduções faltantes

## 1. Tela Inicial - Globo 3D Interativo
- [x] Componente de globo 3D com pins de empreendimentos
- [x] Clusters de cidades que expandem no zoom
- [x] Navbar superior com Login, Signup, My Account, Language Selector, Support
- [x] Barra de busca por localização/nome de empreendimento
- [x] Tooltip ao passar o mouse mostrando "X developments available"
- [ ] Modal de preview de empreendimento ao clicar no pin
- [x] Navegação para página de listagem da cidade ao clicar na cidade

## 2. Página de Listagem de Cidade
- [x] Título da cidade e país
- [x] Contador de empreendimentos
- [x] Painel de filtros (data, preço, rating, amenidades)
- [x] Opções de ordenação
- [x] Cards de empreendimentos com carrossel de fotos
- [x] Navegação para detalhes do empreendimento

## 3. Página de Detalhes do Empreendimento
- [x] Galeria de fotos
- [x] Descrição do empreendimento
- [x] Lista de amenidades
- [x] Mapa de localização
- [ ] Calendário de disponibilidade (vinculado aos slots dos cotistas)
- [x] Lista de negócios patrocinados próximos
- [x] Botão "Reserve Now" com lógica de autenticação
- [ ] Modal de Login/Signup quando não autenticado

## 4. Sistema de Autenticação
- [ ] Tela de Login completa
- [ ] Tela de Signup para clientes
- [ ] Tela de Signup para cotistas (separada)
- [ ] Recuperação de senha
- [ ] Verificação de email
- [ ] Estados de erro (credenciais inválidas, conta bloqueada, pendente de revisão)
- [ ] Retorno ao fluxo de reserva após login bem-sucedido

## 5. Fluxo de Reserva do Cliente
- [ ] 5.1 Tela de seleção de datas
  - [ ] Grid de disponibilidade
  - [ ] Resumo de preços
  - [ ] Políticas de cancelamento
  - [ ] CTA: Continue to Payment
- [x] 5.2 Tela de pagamento
  - [x] Breakdown de preços
  - [x] Redirecionamento para checkout externo (Stripe)
  - [x] Tela "Payment Pending Confirmation"
- [x] 5.3 Tela de upload de documentos
  - [x] Upload de ID
  - [x] Upload de comprovante de endereço
  - [x] Status: "Documents Under Review"
- [ ] 5.4 Tela de acompanhamento de reserva
  - [ ] Timeline com estados
  - [ ] Indicadores visuais de progresso
  - [ ] Mensagens de status
- [ ] 5.5 Tela de entrega de voucher
  - [ ] Botão de download do voucher
  - [ ] Email enviado com template i18n
  - [ ] Status = "Voucher Delivered"

## 6. Portal do Cotista
- [x] 6.1 Registro de cotista
  - [x] Campos de dados pessoais
  - [x] Upload de comprovante de propriedade
  - [ ] Detalhes bancários
  - [x] Endereço
  - [x] Documentos de identidade
  - [ ] Aceitação de termos
  - [ ] Status: "Under Review"
- [ ] 6.2 Dashboard do cotista
  - [ ] Cards de reservas
  - [ ] Vouchers pendentes
  - [ ] Pagamentos
  - [ ] Calendário de disponibilidade
  - [ ] Alertas de compliance
- [ ] 6.3 Gerenciamento de disponibilidade
  - [ ] Adicionar intervalos de datas
  - [ ] Definir preços
  - [ ] Publicar disponibilidade
- [ ] 6.4 Reservas recebidas
  - [ ] Lista de reservas
  - [ ] Dados do cliente
  - [ ] Intervalo de datas
  - [ ] Confirmação de pagamento
  - [ ] Status de aprovação de documentos
  - [ ] Contador de prazo para voucher
  - [ ] Botão: "Upload Voucher"
- [ ] 6.5 Tela de upload de voucher
  - [ ] Upload de arquivo
  - [ ] Notas
  - [ ] Submit → status: "Voucher Under Admin Review"

## 7. Painel Administrativo
- [x] 7.1 Dashboard
  - [x] Métricas de documentos pendentes
  - [x] Validações de cotistas pendentes
  - [x] Aprovações de vouchers
  - [ ] Reservas que precisam de ação manual
  - [ ] Reembolsos
  - [ ] Disputas
  - [ ] Alertas de fraude
- [x] 7.2 Verificação de clientes
  - [x] Visualizador de documentos
  - [x] Aprovar/Rejeitar
  - [ ] Razões de rejeição
  - [ ] Trilha de auditoria
- [x] 7.3 Verificação de cotistas
  - [x] Dossiê completo
  - [ ] Verificação de propriedade
  - [ ] Identidade
  - [ ] Dados bancários
  - [x] Aprovar/Rejeitar
- [ ] 7.4 Gerenciamento de reservas
  - [ ] Visualizar ciclo de vida completo da reserva
  - [ ] Aprovar documentos
  - [ ] Aprovar voucher
  - [ ] Rejeitar voucher
  - [ ] Forçar reembolso
  - [ ] Bloquear cliente
  - [ ] Bloquear cotista
- [ ] 7.5 Gerenciamento de empreendimentos
  - [ ] Registrar empreendimentos
  - [ ] Relacionamento País/Estado/Cidade
  - [ ] Upload de fotos
  - [ ] Descrição
  - [ ] Amenidades
  - [ ] Regras
- [ ] 7.6 Gerenciamento de negócios patrocinados
  - [ ] Criar registros de negócios
  - [ ] Upload de fotos
  - [ ] Definir categorias
  - [ ] Vincular negócios a empreendimentos/cidades
  - [ ] Toggle de ativação
- [ ] 7.7 Gerador de dossiê
  - [ ] Selecionar Cliente ou Cotista
  - [ ] Gerar dossiê completo para download
  - [ ] Incluir: Perfil, Documentos, Vouchers, Reservas, Pagamentos, Disputas, Flags, Notas

## 8. Notificações e Templates de Email Multilíngues
- [ ] Template de confirmação de pagamento
- [ ] Template de documento recebido
- [ ] Template de documento aprovado/rejeitado
- [ ] Template de entrega de voucher
- [ ] Template de lembrete de voucher para cotista
- [ ] Template de reserva criada
- [ ] Template de reembolso processado
- [ ] Template de disputa aberta/fechada
- [ ] Template de verificação de conta
- [ ] Template de aprovação de conta
- [ ] Template de rejeição de conta
- [ ] Sistema de envio de emails com i18n
- [ ] Placeholders para campos variáveis

## 9. Máquinas de Estado
- [ ] 9.1 Estados de Reserva
  - [ ] Created
  - [ ] Awaiting Payment
  - [ ] Payment Pending
  - [ ] Paid
  - [ ] Documents Pending
  - [ ] Documents Under Review
  - [ ] Documents Rejected
  - [ ] Approved
  - [ ] Voucher Pending
  - [ ] Voucher Sent
  - [ ] Voucher Under Review
  - [ ] Voucher Rejected
  - [ ] Voucher Delivered
  - [ ] Completed
  - [ ] Refunded
  - [ ] Cancelled
  - [ ] In Dispute
- [ ] 9.2 Estados de Cotista
  - [ ] Registered
  - [ ] Under Review
  - [ ] Rejected
  - [ ] Approved
  - [ ] Suspended
- [ ] 9.3 Estados de Cliente
  - [ ] Registered
  - [ ] Verified
  - [ ] Under Review
  - [ ] Rejected
  - [ ] Suspended
- [ ] Implementar transições de estado com validações
- [ ] Logs de auditoria para todas as transições

## 10. Tratamento de Erros e Exceções
- [ ] Falha de pagamento
- [ ] Incompatibilidade de webhook
- [ ] Data não mais disponível
- [ ] Cotista removido após reserva
- [ ] Atraso de voucher
- [ ] Documentos inválidos
- [ ] Reserva duplicada (double booking)
- [ ] Chargeback
- [ ] Cancelamento de cliente
- [ ] Períodos não reembolsáveis
- [ ] Escalação de disputa
- [ ] Suspeita de fraude
- [ ] Mensagens de erro com i18n
- [ ] Lógica de fallback para cada erro

## 11. Funcionalidades Adicionais
- [x] URLs amigáveis (slugs) para cidades e empreendimentos
- [x] Dados de exemplo (seed) com cidades e empreendimentos
- [x] Integração Stripe para pagamentos
- [x] Sistema de upload de documentos para S3
- [ ] Sistema de busca funcional
- [ ] Filtros avançados na listagem
- [ ] Sistema de ratings e reviews
- [ ] Sistema de disputas
- [ ] Sistema de reembolsos
- [ ] Painel de analytics para admin
- [ ] Relatórios financeiros
- [ ] Exportação de dados

## 12. Testes
- [ ] Testes de procedimentos tRPC
- [ ] Testes de fluxos de autenticação
- [ ] Testes de máquinas de estado
- [ ] Testes de validações
- [ ] Testes de upload de documentos
- [ ] Testes de pagamento Stripe
- [ ] Testes de webhooks
- [ ] Testes de notificações

## Status Atual
- [x] Schema do banco de dados completo (21 tabelas)
- [x] Sistema i18n básico implementado
- [x] Globo 3D com Google Maps
- [x] Navbar e navegação básica
- [x] Páginas de listagem e detalhes
- [x] Integração Stripe
- [x] Upload de documentos para clientes
- [x] Upload de documentos para cotistas
- [x] Painel administrativo básico
- [x] Aprovação de documentos
- [x] Aprovação de cotistas
- [x] Link para Stripe Dashboard

## Próximas Prioridades
1. Implementar portal completo do cotista
2. Desenvolver máquinas de estado
3. Criar sistema de notificações e emails
4. Completar calendário de disponibilidade
5. Implementar tratamento de erros
6. Criar todos os testes
