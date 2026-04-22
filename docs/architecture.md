## 📄 docs/architecture.md
```md
# 🧱 Arquitetura - Frontend

## 🎯 Objetivo

Interface moderna e escalável para gerenciamento de jogos.

---

## 📁 Estrutura


src/
components/
pages/
services/
types/


---

## 🧩 Organização

### Pages
- Dashboard → visão geral
- Games → CRUD
- Assistant → IA (mock)
- Settings → usuário

---

### AppShell

Layout base com sidebar e header.

---

### API Service

Centraliza chamadas HTTP.

---

## 🔄 Fluxo

1. Usuário interage com UI
2. Página chama API
3. Estado atualizado
4. UI renderiza

---

## 🔌 Integração

- REST API (Go)
- JWT via localStorage