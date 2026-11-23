export default function AppLoading() {
  return (
    <div className="app-loading" role="status" aria-live="polite">
      <div className="app-loading__keys" aria-hidden="true">
        <span>F</span>
        <span>J</span>
      </div>
      <strong>Conectando à sua conta</strong>
      <p>Carregando seu progresso do banco de dados.</p>
    </div>
  )
}
