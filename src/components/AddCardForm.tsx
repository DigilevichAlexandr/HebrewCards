import { useState } from 'react';

interface Props {
  onAdd: (hebrew: string, russian: string) => boolean;
}

export function AddCardForm({ onAdd }: Props) {
  const [hebrew, setHebrew] = useState('');
  const [russian, setRussian] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onAdd(hebrew, russian);
    if (ok) {
      setHebrew('');
      setRussian('');
      setMessage('Карточка добавлена!');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('Заполните оба поля');
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Новая карточка</h2>
      <label>
        Слово на иврите
        <input
          type="text"
          dir="rtl"
          lang="he"
          value={hebrew}
          onChange={(e) => setHebrew(e.target.value)}
          placeholder="לדוגמה"
          autoComplete="off"
        />
      </label>
      <label>
        Перевод на русский
        <input
          type="text"
          value={russian}
          onChange={(e) => setRussian(e.target.value)}
          placeholder="Например: пример"
          autoComplete="off"
        />
      </label>
      <button type="submit" className="btn btn-primary">
        Добавить карточку
      </button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
