<script lang="ts">
	import { CheckCircle2, Clock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-svelte';
	import { lexdataMetrics, lexdataStore } from '#lib/stores/lexdataStore.ts';
	import { formatDateTimeCL } from '#lib/utils/formatters.ts';

	const tenCommandments = [
		{
			code: '01',
			title: 'Prohibición de Pendrives y Medios Extraíbles',
			detail: 'Todo almacenamiento externo no cifrado ni autorizado por TI queda estrictamente prohibido.'
		},
		{
			code: '02',
			title: 'Cierre de Viernes y Vaciado de Temporales',
			detail: 'Eliminar descargas locales, archivos temporales y vaciar papelera al cierre de cada jornada.'
		},
		{
			code: '03',
			title: 'Bloqueo Automático de Sesión',
			detail: 'Bloquear estación de trabajo (Win+L / Ctrl+Cmd+Q) cada vez que se ausente del puesto.'
		},
		{
			code: '04',
			title: 'Uso Exclusivo de Canales Corporativos',
			detail: 'Prohibido enviar nóminas, RUTs o cotizaciones por WhatsApp personal o correos gratuitos.'
		},
		{
			code: '05',
			title: 'Prohibición de Descarga Masiva de CRM',
			detail: 'Los ejecutivos comerciales operan sobre vista enmascarada y central VoIP auditada.'
		},
		{
			code: '06',
			title: 'Escritorio y Obra Limpia de Documentos',
			detail: 'No dejar contratos impresos ni copias de cédulas sobre escritorios o casetas de faena.'
		},
		{
			code: '07',
			title: 'Verificación de Destinatario antes de Enviar',
			detail: 'Validar dominio y copia oculta (CCO) antes de remitir información con datos personales.'
		},
		{
			code: '08',
			title: 'Credenciales Únicas e Intransferibles',
			detail: 'Prohibido compartir usuarios o contraseñas de Libro de Obras Electrónico o ERP.'
		},
		{
			code: '09',
			title: 'Escalamiento Inmediato de Incidentes',
			detail: 'Reportar extravíos o envíos erróneos en menos de 2 horas para activar el reloj de 72h.'
		},
		{
			code: '10',
			title: 'Respeto Estricto a Solicitudes ARSOPB',
			detail: 'Cualquier petición de bloqueo o eliminación de un titular se deriva de inmediato al DPO Externo.'
		}
	];
</script>

<header class="page-header">
	<div>
		<div class="page-eyebrow">
			Debida Diligencia Laboral · Eximente de Responsabilidad Corporativa
		</div>
		<h1 class="page-title">Traspaso de Responsabilidad y Higiene Digital</h1>
		<p class="page-lead">
			Acreditación continua de capacitación y cumplimiento semanal por puesto de trabajo para
			eximir a {$lexdataStore.organization.name} ante negligencia individual de un colaborador.
		</p>
	</div>
	<div class="coverage-pill">
		<UserCheck size={16} strokeWidth={1.5} />
		<span class="tabular">
			<strong>{$lexdataMetrics.compliantWorkersCount} de {$lexdataStore.organization.totalWorkers}</strong> trabajadores acreditados
		</span>
	</div>
</header>

<!-- Indicador de Cobertura Interna -->
<section class="card">
	<div class="card-body coverage-grid">
		<div class="coverage-summary">
			<div class="coverage-label">Cobertura Interna de Protocolo Firmado y Capacitación Aprobada</div>
			<div class="coverage-numbers">
				<span class="coverage-big font-serif tabular">
					{$lexdataMetrics.compliantWorkersCount} / {$lexdataStore.organization.totalWorkers}
				</span>
				<span class="badge {$lexdataMetrics.pendingWorkersCount === 0 ? 'badge-legal' : 'badge-alert'} tabular">
					{$lexdataMetrics.coveragePercent}% Cobertura ({$lexdataMetrics.pendingWorkersCount} pendientes)
				</span>
			</div>
			<div class="progress-track" aria-label="Progreso de cobertura interna">
				<div class="progress-fill" style="width: {$lexdataMetrics.coveragePercent}%;"></div>
			</div>
		</div>

		<div class="coverage-legal-note">
			<div class="note-title">
				<ShieldCheck size={16} strokeWidth={1.5} color="#0F5132" />
				<span>Efecto Probatorio ante Fiscalización</span>
			</div>
			<p>
				Cada confirmación estampa fecha/hora de cierre de turno y respalda la capacitación
				asincrónica aprobada, acreditando el deber de dirección y vigilancia del empleador
				(Art. 49 Ley 21.719).
			</p>
		</div>
	</div>
</section>

<div class="workers-layout">
	<!-- Tabla de Control de Puesto -->
	<section class="card">
		<div class="card-header">
			<div>
				<h2 class="card-title">Higiene Digital y Cierre de Turno (Muestra Operativa)</h2>
				<p class="card-subtitle">
					Además de 40 puestos en faena y administración ya certificados, supervise y confirme los
					cierres pendientes en vivo.
				</p>
			</div>
			<span class="badge badge-neutral tabular">
				{$lexdataMetrics.pendingWorkersCount} por confirmar
			</span>
		</div>

		<div class="table-wrap">
			<table class="data-table">
				<thead>
					<tr>
						<th>Trabajador / Cargo</th>
						<th>Cápsula Asincrónica + Quiz</th>
						<th>Checklist Cierre Viernes (Borrado Temporales y Papelera)</th>
						<th>Estatus Legal</th>
					</tr>
				</thead>
				<tbody>
					{#each $lexdataStore.workers as worker (worker.id)}
						<tr>
							<td>
								<div style="font-weight: 600;">{worker.workerLabel}</div>
								<div style="font-size: 11.5px; color: var(--text-secondary);">{worker.department}</div>
							</td>
							<td>
								{#if worker.capsuleStatus === 'Pendiente'}
									<span class="badge badge-alert">
										<AlertCircle size={12} strokeWidth={1.5} />
										{worker.capsuleStatus}
									</span>
								{:else}
									<span class="badge badge-legal">
										<CheckCircle2 size={12} strokeWidth={1.5} />
										{worker.capsuleStatus}
									</span>
								{/if}
							</td>
							<td>
								{#if worker.fridayChecklistDone && worker.confirmedAt}
									<div style="display: flex; flex-direction: column; gap: 2px;">
										<span style="font-weight: 600; color: var(--accent-legal); font-size: 12.5px;">
											Verificado y Limpio
										</span>
										<span class="font-mono tabular" style="font-size: 11px; color: var(--text-secondary);">
											{formatDateTimeCL(worker.confirmedAt)}
										</span>
									</div>
								{:else}
									<button
										type="button"
										class="btn btn-primary btn-sm"
										onclick={() => lexdataStore.confirmWorkerClosure(worker.id)}
									>
										<Clock size={13} strokeWidth={1.5} />
										Confirmar Cierre de Turno
									</button>
								{/if}
							</td>
							<td>
								{#if worker.legalStatus === 'Empresa Eximida - Cumplimiento Acreditado'}
									<span class="badge badge-legal">{worker.legalStatus}</span>
								{:else}
									<span class="badge badge-alert">Pendiente</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Panel Lateral: Los 10 Mandamientos del Usuario -->
	<aside class="card">
		<div class="card-header">
			<div>
				<h2 class="card-title">Los 10 Mandamientos del Usuario</h2>
				<p class="card-subtitle">Reglas operativas obligatorias incorporadas al Reglamento Interno</p>
			</div>
		</div>
		<div class="card-body">
			<ol class="commandments-list">
				{#each tenCommandments as rule (rule.code)}
					<li class="commandment-item">
						<span class="rule-code font-mono">{rule.code}</span>
						<div>
							<div class="rule-title">{rule.title}</div>
							<div class="rule-detail">{rule.detail}</div>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</aside>
</div>

<style>
	.coverage-pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 14px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		font-size: 13px;
	}

	.coverage-grid {
		display: grid;
		grid-template-columns: 1.35fr 1fr;
		gap: 24px;
		align-items: center;
	}

	.coverage-label {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 6px;
	}

	.coverage-numbers {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 10px;
	}

	.coverage-big {
		font-size: 28px;
		font-weight: 600;
		line-height: 1;
	}

	.progress-track {
		width: 100%;
		height: 8px;
		background-color: var(--bg-canvas);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--accent-legal);
		transition: width 0.25s ease;
	}

	.coverage-legal-note {
		padding: 14px 16px;
		background-color: var(--bg-surface-muted);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		font-size: 12.5px;
		color: var(--text-secondary);
	}

	.note-title {
		display: flex;
		align-items: center;
		gap: 7px;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 5px;
	}

	.workers-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.85fr);
		gap: 20px;
		align-items: start;
	}

	.commandments-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 11px;
	}

	.commandment-item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.commandment-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.rule-code {
		font-size: 11px;
		font-weight: 500;
		padding: 2px 6px;
		background-color: var(--bg-canvas);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		color: var(--accent-legal);
		flex-shrink: 0;
		margin-top: 1px;
	}

	.rule-title {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.rule-detail {
		font-size: 12px;
		color: var(--text-secondary);
		margin-top: 2px;
		line-height: 1.4;
	}

	@media (max-width: 1120px) {
		.coverage-grid,
		.workers-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
