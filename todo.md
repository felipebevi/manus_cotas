# Project TODO

## Sistema i18n e Infraestrutura
- [x] Sistema de internacionalização (i18n) com suporte a PT, EN, ES, FR, IT, JP
- [x] Seletor de idioma no header
- [x] Detecção automática de locale do navegador

## Schema do Banco de Dados
- [x] Tabela de traduções (i18n)
- [x] Tabela de países, estados e cidades
- [x] Tabela de empreendimentos (developments)
- [x] Tabela de amenidades
- [x] Tabela de fotos
- [x] Tabela de negócios patrocinados
- [x] Tabela de cotistas (fractional owners)
- [x] Tabela de disponibilidade de cotistas
- [x] Tabela de reservas
- [x] Tabela de documentos
- [x] Tabela de vouchers
- [x] Tabela de pagamentos
- [x] Tabela de disputas
- [x] Tabela de notas de auditoria

## Tela Inicial - Globo 3D Interativo
- [x] Componente de globo 3D com pins de empreendimentos
- [x] Clusters de cidades que expandem no zoom
- [x] Navbar superior com Login, Signup, My Account, Language Selector, Support
- [x] Barra de busca por localização/nome de empreendimento
- [x] Tooltip ao passar o mouse mostrando "X developments available"
- [ ] Modal de preview de empreendimento ao clicar no pin
- [x] Navegação para página de listagem da cidade

## Página de Listagem de Cidade
- [x] Título da cidade e país
- [x] Contador de empreendimentos
- [x] Painel de filtros (data, preço, rating, amenidades)
- [x] Opções de ordenação
- [x] Cards de empreendimentos com carrossel de fotos
- [x] Navegação para detalhes do empreendimento

## Página de Detalhes do Empreendimento
- [x] Galeria de fotos
- [x] Descrição do empreendimento
- [x] Lista de amenidades
- [x] Mapa de localização
- [ ] Calendário de disponibilidade
- [x] Lista de negócios patrocinados próximos
- [x] Botão "Reserve Now" com lógica de autenticação

## Sistema de Autenticação
- [ ] Tela de Login
- [ ] Tela de Signup (cliente)
- [ ] Tela de Signup (cotista)
- [ ] Recuperação de senha
- [ ] Verificação de email
- [ ] Estados de erro (credenciais inválidas, conta bloqueada, pendente de revisão)
- [ ] Retorno ao fluxo de reserva após login

## Fluxo de Reserva do Cliente
- [ ] Tela de seleção de datas com grid de disponibilidade
- [ ] Resumo de preços e políticas
- [ ] Tela de pagamento com redirecionamento externo
- [ ] Tela de upload de documentos (ID, comprovante de endereço)
- [ ] Tela de acompanhamento de reserva com timeline
- [ ] Tela de entrega de voucher com download

## Portal do Cotista
- [ ] Formulário de registro de cotista
- [ ] Dashboard com cards de reservas, vouchers pendentes, pagamentos
- [ ] Gerenciamento de disponibilidade (adicionar datas, definir preços)
- [ ] Lista de reservas recebidas
- [ ] Tela de upload de voucher
- [ ] Alertas de compliance

## Painel Administrativo
- [ ] Dashboard com métricas (documentos pendentes, validações, aprovações)
- [ ] Verificação de documentos de clientes (aprovar/rejeitar)
- [ ] Verificação de cotistas (dossier completo)
- [ ] Gerenciamento de reservas (aprovar documentos, aprovar/rejeitar voucher, forçar reembolso)
- [ ] Gerenciamento de empreendimentos (registrar, fotos, descrição, amenidades)
- [ ] Gerenciamento de negócios patrocinados
- [ ] Gerador de dossiê (cliente ou cotista)
- [ ] Bloqueio de clientes e cotistas

## Máquinas de Estado
- [ ] Estados de reserva (Created, Awaiting Payment, Paid, Documents Pending, etc.)
- [ ] Estados de cotista (Registered, Under Review, Approved, Rejected, Suspended)
- [ ] Estados de cliente (Registered, Verified, Under Review, Rejected, Suspended)
- [ ] Transições de estado com validações

## Notificações e Emails
- [ ] Template de confirmação de pagamento
- [ ] Template de documentos recebidos
- [ ] Template de documentos aprovados/rejeitados
- [ ] Template de entrega de voucher
- [ ] Template de lembrete de voucher para cotista
- [ ] Template de reserva criada
- [ ] Template de reembolso processado
- [ ] Template de disputa aberta/fechada
- [ ] Template de verificação de conta
- [ ] Template de aprovação/rejeição de conta

## Tratamento de Erros e Exceções
- [ ] Falha de pagamento
- [ ] Incompatibilidade de webhook
- [ ] Data não mais disponível
- [ ] Cotista removido após reserva
- [ ] Atraso de voucher
- [ ] Documentos inválidos
- [ ] Reserva duplicada
- [ ] Chargeback
- [ ] Cancelamento de cliente
- [ ] Períodos não reembolsáveis
- [ ] Escalação de disputa
- [ ] Suspeita de fraude

## Testes
- [ ] Testes de procedimentos tRPC
- [ ] Testes de fluxos de autenticação
- [ ] Testes de máquinas de estado
- [ ] Testes de validações

## Correções de Bugs
- [x] Corrigir erro de elementos <a> aninhados no Navbar
