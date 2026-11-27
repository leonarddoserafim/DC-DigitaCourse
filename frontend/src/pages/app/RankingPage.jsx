import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/app/PageHeader'
import AppIcon from '../../components/AppIcon'
import {
  ArrowUpRight,
  CheckCircle,
  EyeOff,
  Flame,
  Star,
  Trophy,
  Users,
  Zap,
} from '../../components/Icons'
import { useApp } from '../../context/AppContext'
import { rankingUsers } from '../../data/community'
import usePageMeta from '../../hooks/usePageMeta'
import { buildRanking } from '../../lib/metrics'
import { formatNumber } from '../../lib/format'

const periods = [
  { id: 'semanal', label: 'Semanal', hint: 'XP dos últimos sete dias' },
  { id: 'mensal', label: 'Mensal', hint: 'XP dos últimos trinta dias' },
  { id: 'geral', label: 'Geral', hint: 'XP acumulado desde o início' },
]

export default function RankingPage() {
  const { user, stats, prefs } = useApp()
  const [period, setPeriod] = useState('semanal')

  usePageMeta(
    'Ranking — DigitaCourse',
    'Compare seu ritmo de prática com a comunidade de demonstração do DigitaCourse.',
  )

  const ranking = useMemo(
    () =>
      buildRanking(rankingUsers, {
        user,
        stats,
        period,
        publicProfile: prefs.publicProfile,
      }),
    [user, stats, period, prefs.publicProfile],
  )

  const current = ranking.find((entry) => entry.isCurrent)
  const top = ranking.slice(0, 3)
  const podium = [top[1], top[0], top[2]].filter(Boolean)
  const activePeriod = periods.find((item) => item.id === period) ?? periods[0]
  const topScore = ranking[0]?.score ?? 0

  return (
    <div className="app-page ranking-page">
      <PageHeader
        eyebrow="Ranking"
        title="Ritmo também é uma forma de competir."
        description="Um ranking para dar contexto, não para virar pressão. A comparação mais importante continua sendo com você mesmo."
        actions={
          <Link className="btn btn--outline" to="/app/desafios">
            Ver desafios
            <ArrowUpRight size={15} />
          </Link>
        }
      />

      <div className="ranking-toolbar" data-reveal>
        <div
          className="app-segmented app-segmented--lg"
          role="group"
          aria-label="Período do ranking"
        >
          {periods.map((item) => (
            <button
              key={item.id}
              type="button"
              className={period === item.id ? 'is-active' : ''}
              onClick={() => setPeriod(item.id)}
              aria-pressed={period === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="ranking-toolbar__hint">
          <Zap size={14} />
          {activePeriod.hint}
        </span>
      </div>

      <div className="ranking-grid">
        <div className="ranking-main">
          <section className="ranking-podium" data-reveal>
            <div className="ranking-podium__head">
              <span className="app-eyebrow app-eyebrow--light">Pódio da temporada</span>
              <strong>{activePeriod.label}</strong>
            </div>
            <div className={`ranking-podium__places ranking-podium__places--${podium.length}`}>
              {podium.map((entry) => (
                <article
                  className={`podium-place podium-place--${entry.position}${
                    entry.isCurrent ? ' is-current' : ''
                  }`}
                  key={entry.id}
                >
                  {entry.position === 1 && (
                    <span className="podium-place__crown" aria-hidden="true">
                      <Trophy size={21} />
                    </span>
                  )}
                  <span className={`podium-place__avatar app-avatar app-avatar--${entry.tone}`}>
                    {entry.initials}
                  </span>
                  <span className="podium-place__position">
                    {entry.position === 1 ? '1º' : `${entry.position}º`}
                  </span>
                  <strong>{entry.name}</strong>
                  <small>{entry.course}</small>
                  <span className="podium-place__score">
                    {formatNumber(entry.score)}
                    <small>XP</small>
                  </span>
                  <span className="podium-place__base" aria-hidden="true">
                    <i />
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="app-panel ranking-table-panel" data-reveal>
            <div className="app-panel__head">
              <div>
                <span className="app-eyebrow">Classificação</span>
                <h2>{ranking.length} participantes</h2>
                <p>Velocidade média e precisão aparecem como referência de desempenho.</p>
              </div>
              <span className="ranking-table-panel__top">
                <Star size={14} />
                {formatNumber(topScore)} XP no topo
              </span>
            </div>

            <div className="ranking-table-wrap">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th scope="col">Pos.</th>
                    <th scope="col">Participante</th>
                    <th scope="col">Trilha</th>
                    <th scope="col">WPM</th>
                    <th scope="col">Precisão</th>
                    <th scope="col">{activePeriod.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((entry) => (
                    <tr key={entry.id} className={entry.isCurrent ? 'is-current' : ''}>
                      <td>
                        <span
                          className={`ranking-table__position${entry.position <= 3 ? ' is-top' : ''}`}
                        >
                          {entry.position}
                        </span>
                      </td>
                      <td>
                        <span className="ranking-table__user">
                          <span className={`app-avatar app-avatar--sm app-avatar--${entry.tone}`}>
                            {entry.initials}
                          </span>
                          <span>
                            <strong>
                              {entry.name}
                              {entry.isCurrent && <em>você</em>}
                            </strong>
                            <small>{entry.course}</small>
                          </span>
                        </span>
                      </td>
                      <td>{entry.course}</td>
                      <td>{entry.wpm} WPM</td>
                      <td>{formatNumber(entry.accuracy, 1)}%</td>
                      <td>
                        <strong className="ranking-table__score">
                          {formatNumber(entry.score)} XP
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="ranking-table-panel__note">
              <Users size={14} />
              Os demais participantes são perfis fictícios usados para demonstrar a interface.
              Nenhum dado real é compartilhado.
            </p>
          </section>
        </div>

        <aside className="ranking-aside">
          <section className="ranking-you" data-reveal>
            <span className="app-eyebrow app-eyebrow--light">Sua posição</span>
            {current ? (
              <>
                <strong className="ranking-you__position">{current.position}º</strong>
                <p>
                  entre {ranking.length} participantes no período{' '}
                  <strong>{activePeriod.label.toLowerCase()}</strong>.
                </p>
                <div className="ranking-you__stats">
                  <span>
                    <Zap size={15} />
                    {formatNumber(current.score)} XP
                  </span>
                  <span>
                    <Flame size={15} />
                    {stats.streak} dias
                  </span>
                </div>
                <div className="ranking-you__next">
                  {current.position > 1 ? (
                    <>
                      <span>Próximo degrau</span>
                      <strong>
                        {formatNumber(ranking[current.position - 2].score - current.score)} XP atrás
                        de {ranking[current.position - 2].name.split(' ')[0]}
                      </strong>
                    </>
                  ) : (
                    <>
                      <span>Liderança</span>
                      <strong>Você está no topo. Agora é manter o ritmo.</strong>
                    </>
                  )}
                </div>
                <Link className="btn btn--mint btn--sm" to="/app/praticar/fund-01">
                  Somar mais XP
                  <ArrowUpRight size={14} />
                </Link>
              </>
            ) : (
              <>
                <span className="ranking-you__hidden">
                  <EyeOff size={24} />
                </span>
                <h2>Perfil fora do ranking</h2>
                <p>
                  Seu perfil está oculto por escolha. Você continua acumulando XP normalmente, mas
                  não aparece na classificação.
                </p>
                <Link className="btn btn--mint btn--sm" to="/app/perfil">
                  Ajustar privacidade
                  <ArrowUpRight size={14} />
                </Link>
              </>
            )}
          </section>

          <section className="app-panel ranking-how" data-reveal>
            <span className="app-eyebrow">Como pontuar</span>
            <h2>Cada prática soma.</h2>
            <ul>
              <li>
                <span>
                  <CheckCircle size={16} />
                </span>
                <p>
                  <strong>Lição concluída</strong>O XP da lição entra no seu total, com bônus por
                  precisão acima de 98%.
                </p>
              </li>
              <li>
                <span>
                  <Flame size={16} />
                </span>
                <p>
                  <strong>Constância</strong>
                  Praticar em dias diferentes melhora seu ritmo semanal e seus desafios.
                </p>
              </li>
              <li>
                <span>
                  <Trophy size={16} />
                </span>
                <p>
                  <strong>Desafios</strong>
                  Metas concluídas adicionam experiência e alimentam suas conquistas.
                </p>
              </li>
            </ul>
            <Link className="app-panel__link" to="/app/perfil">
              Gerenciar perfil público
              <ArrowUpRight size={15} />
            </Link>
          </section>

          <section className="ranking-community" data-reveal>
            <AppIcon name="spark" size={20} />
            <p>
              <strong>Comunidade de demonstração.</strong> O ranking é local e ilustrativo nesta
              etapa. A classificação real chegará com a API.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
