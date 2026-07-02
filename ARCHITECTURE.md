# Architecture

## Стек
•⁠  ⁠React 18 + TypeScript
•⁠  ⁠Zustand для стейт-менеджмента
•⁠  ⁠React Router v6 для роутинга
•⁠  ⁠React Hook Form для форм
•⁠  ⁠dnd-kit для Drag & Drop
•⁠  ⁠Vite как сборщик

## Структура
src/
  pages/     - страницы (login, boards, board, profile)
  store/     - глобальное состояние (Zustand)
  types/     - TypeScript типы
  components/ - переиспользуемые компоненты

## Решения
•⁠  ⁠Zustand выбран вместо Redux за простоту
•⁠  ⁠localStorage для хранения данных пользователя
•⁠  ⁠dnd-kit для перетаскивания карточек
