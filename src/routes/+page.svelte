<script lang="ts">
	import {
		FileText,
		ShieldCheck,
		AlertTriangle,
		Clock,
		CheckCircle2,
		Building2,
		Scale,
		Cpu,
		Lock,
		Activity
	} from 'lucide-svelte';
	import { lexdataMetrics, lexdataStore } from '#lib/stores/lexdataStore.ts';
	import { formatDateTimeCL, maskFullName, maskRut } from '#lib/utils/formatters.ts';
	import InspectionDossierModal from '#lib/components/InspectionDossierModal.svelte';

	let dossierOpen = $state(false);
	const isRestricted = $derived($lexdataStore.sessionRole === 'comercial');
</script>

<section class="governance-bar" aria-label="Arquitectura de independencia legal">
	<div class="gov-item">
		<div class="gov-icon">
			<Scale size={15} strokeWidth={1.5} />
		</div>
		<div>
			<div class="gov-role">Implementación Jurídica</div>
			<div class="gov-desc">{$lexdataStore.governance.legalImplementation}</div>
		</div>
	</div>

	<div class="gov-item">
		<div class="gov-icon gov-icon-legal">
			<ShieldCheck size={15} strokeWidth={1.5} />
		</div>
		<div>
			<div class="gov-role">DPO Externo Independiente</div>
			<div class="gov-desc">{$lexdataStore.governance.externalDpo}</div>
		</div>
	</div>

	<div class="gov-item">
		<div class="gov-icon">
			<Cpu size={15} strokeWidth={1.5} />
		</div>
		<div>
			<div class="gov-role">Infraestructura &amp; Monitoreo</div>
			<div class="gov-desc">{$lexdataStore.governance.techOperation}</div>
		</div>
	</div>
</section>

<header class="page-header">
	<div>
		<div class="page-eyebrow">
			Gobierno Corporativo de Datos · Matriz de Evidencia Exigible (Ley 21.719)
		</div>
		<h1 class="page-title">Dashboard Ejecutivo y Simulador de Fiscalización</h1>
		<p class="page-lead">
			Control centralizado de licitud, plazos legales de retención, trazabilidad probatoria y
			verificación técnica continua para {$lexdataStore.organization.name}.
		</p>
	</div>

	<div class="header-actions">
		<button
			type="button"
			class="btn btn-primary"
			onclick={() => (dossierOpen = true)}
		>
			<FileText size={16} strokeWidth={1.5} />
			Simular Fiscalización Agencia (Generar Dossier PDF)
		</button>
	</div>
</header>

{#if $lexdataStore.sessionRole === 'comercial'}
	<div class="alert-banner alert">
		<div style="display: flex; align-items: center; gap: 10px;">
			<Lock size={17} strokeWidth={1.5} />
			<div>
				<strong>Vista Ejecutiva en Modo Restringido:</strong> El perfil Comercial mantiene acceso de
				lectura gerencial a indicadores agregados, pero la exportación masiva y datos identificatorios
				de titulares permanecen bloqueados por Política de Seguridad Ley 21.719.
			</div>
		</div>
	</div>
{/if}

<section class="swiss-kpi-grid" aria-label="Indicadores clave de cumplimiento">
	<div class="kpi-cell">
		<div class="kpi-label">
			<span>Índice de Cumplimiento Ley 21.719</span>
			<span class="badge badge-{$lexdataMetrics.complianceTone}">
				{$lexdataMetrics.complianceBadge}
			</span>
		</div>
		<div class="kpi-value tabular">{$lexdataMetrics.complianceIndex}%</div>
		<div class="kpi-meta tabular">
			{$lexdataMetrics.compliantWorkersCount} de {$lexdataStore.organization.totalWorkers} trabajadores
			capacitados y {$lexdataStore.ratMatrix.length} bases lícitas acreditadas.
		</div>
	</div>

	<div class="kpi-cell">
		<div class="kpi-label">
			<span>Exposición a Multas (Tope 20.000 UTM)</span>
			<AlertTriangle
				size={15}
				strokeWidth={1.5}
				color={$lexdataStore.subscriptionStatus === 'suspended' ? '#991B1B' : '#0F5132'}
			/>
		</div>
		<div
			class="kpi-value-compact"
			style="color: {$lexdataStore.subscriptionStatus === 'suspended'
				? 'var(--accent-danger)'
				: $lexdataMetrics.activeBreaches.length > 0
					? 'var(--accent-alert)'
					: 'var(--accent-legal)'};"
		>
			{$lexdataMetrics.fineExposureLabel}
		</div>
		<div class="kpi-meta">{$lexdataMetrics.fineExposureMeta}</div>
	</div>

	<div class="kpi-cell">
		<div class="kpi-label">
			<span>Solicitudes ARSOPB / Bloqueos</span>
			<Clock size={15} strokeWidth={1.5} />
		</div>
		<div class="kpi-value tabular">{$lexdataMetrics.activeArsopbCount} Activas</div>
		<div class="kpi-meta">
			Plazo legal: 2 días hábiles bloqueo temporal / 30 días acceso o supresión.
		</div>
	</div>

	<div class="kpi-cell">
		<div class="kpi-label">
			<span>Auditoría Técnica Automatizada</span>
			<Activity size={15} strokeWidth={1.5} />
		</div>
		<div class="kpi-value-compact">
			{$lexdataStore.subscriptionStatus === 'active'
				? 'Al Día (Plan Mensual)'
				: 'Detenida por Mora'}
		</div>
		<div class="kpi-meta tabular">
			{$lexdataMetrics.technicalChecksCount} chequeos ejecutados este mes sin hallazgos.
		</div>
	</div>
</section>

<section class="card">
	<div class="card-header">
		<div>
			<h2 class="card-title">Matriz RAT Inteligente (Registro de Actividades de Tratamiento — Art. 14 ter)</h2>
			<p class="card-subtitle">
				Inventario vivo de bases de datos de {$lexdataStore.organization.name}, con fundamento de licitud y regla automática de retención.
			</p>
		</div>
		<span class="badge badge-legal">
			<CheckCircle2 size={13} strokeWidth={1.5} />
			3 Bases Documentadas
		</span>
	</div>

	<div class="table-wrap">
		<table class="data-table">
			<thead>
				<tr>
					<th>Base de Datos / Activo</th>
					<th>Finalidad del Tratamiento</th>
					<th>Base de Licitud</th>
					<th>Plazo Legal de Retención</th>
					<th>Medida de Resguardo</th>
				</tr>
			</thead>
			<tbody>
				{#each $lexdataStore.ratMatrix as entry (entry.id)}
					<tr>
						<td>
							<div style="font-weight: 600; color: var(--text-primary);">{entry.databaseName}</div>
							<div class="font-mono" style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
								Riesgo Residual: {entry.riskLevel}
							</div>
						</td>
						<td style="max-width: 300px; color: var(--text-secondary);">{entry.purpose}</td>
						<td>
							<span class="badge badge-neutral">{entry.lawfulBasis}</span>
						</td>
						<td style="font-weight: 500;">{entry.retentionPeriod}</td>
						<td>
							<span class="badge badge-legal">
								<ShieldCheck size={12} strokeWidth={1.5} />
								{entry.securityControl}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<section class="two-col-grid">
	<div class="card">
		<div class="card-header">
			<div>
				<h2 class="card-title">Bandeja de Derechos ARSOPB &amp; Bloqueos</h2>
				<p class="card-subtitle">
					{isRestricted
						? 'Identidad reservada en sesión comercial — Gestión exclusiva del DPO Externo'
						: 'Control de plazos legales con identificación completa bajo supervisión del DPO Externo'}
				</p>
			</div>
			<div style="display: flex; align-items: center; gap: 6px;">
				{#if isRestricted}
					<span class="badge badge-neutral">
						<Lock size={12} strokeWidth={1.5} />
						Enmascarado
					</span>
				{/if}
				<span class="badge badge-alert tabular">{$lexdataMetrics.activeArsopbCount} en curso</span>
			</div>
		</div>
		<div class="table-wrap">
			<table class="data-table">
				<thead>
					<tr>
						<th>Folio</th>
						<th>Derecho Ejercido</th>
						<th>Titular</th>
						<th>Plazo Legal</th>
						<th>Estado</th>
					</tr>
				</thead>
				<tbody>
					{#each $lexdataStore.arsopbRequests as req (req.id)}
						<tr>
							<td class="font-mono tabular nowrap-cell" style="font-weight: 500;">{req.code}</td>
							<td style="font-weight: 600;">{req.rightType}</td>
							<td>
								<div style="font-weight: 600;">
									{isRestricted ? maskFullName(req.requesterName) : req.requesterName}
								</div>
								<div class="font-mono tabular" style="font-size: 11.5px; color: var(--text-secondary);">
									{isRestricted ? maskRut(req.requesterRut) : req.requesterRut}
								</div>
							</td>
							<td class="tabular nowrap-cell">
								{req.legalDeadlineDays} días hábiles
								<div style="font-size: 11px; color: var(--text-secondary);">
									Restan {req.daysRemaining} día(s)
								</div>
							</td>
							<td>
								<span class="badge {req.daysRemaining <= 2 ? 'badge-alert' : 'badge-legal'}">
									{req.status}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div class="card">
		<div class="card-header">
			<div>
				<h2 class="card-title">Verificación Técnica Mensual Automatizada</h2>
				<p class="card-subtitle">Controles de seguridad ejecutados en infraestructura y CRM</p>
			</div>
			<span class="badge badge-legal">4 / 4 Conformes</span>
		</div>
		<div class="table-wrap">
			<table class="data-table">
				<thead>
					<tr>
						<th>Control Verificado</th>
						<th>Ejecución</th>
						<th>Resultado</th>
					</tr>
				</thead>
				<tbody>
					{#each $lexdataStore.technicalChecks as check (check.id)}
						<tr>
							<td>
								<div style="font-weight: 600;">{check.name}</div>
								<div style="font-size: 11.5px; color: var(--text-secondary);">{check.category}</div>
							</td>
							<td class="font-mono tabular" style="font-size: 12px; color: var(--text-secondary);">
								{formatDateTimeCL(check.executedAt)}
							</td>
							<td>
								<span class="badge badge-legal">
									<CheckCircle2 size={12} strokeWidth={1.5} />
									{check.result}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<section class="card org-footprint">
	<div class="card-body footprint-grid">
		<div class="footprint-lead">
			<Building2 size={18} strokeWidth={1.5} />
			<div>
				<div style="font-weight: 600;">{$lexdataStore.organization.name}</div>
				<div style="font-size: 12.5px; color: var(--text-secondary);">
					RUT {$lexdataStore.organization.rut} · {$lexdataStore.organization.totalWorkers} trabajadores
					({$lexdataStore.organization.commercialExecutives} ejecutivos comerciales)
				</div>
			</div>
		</div>
		<div class="footprint-systems">
			<span class="font-mono" style="font-size: 11px; color: var(--text-secondary); text-transform: uppercase;">
				Sistemas bajo monitoreo:
			</span>
			{#each $lexdataStore.organization.systems as sys (sys)}
				<span class="badge badge-neutral">{sys}</span>
			{/each}
		</div>
	</div>
</section>

<InspectionDossierModal open={dossierOpen} onClose={() => (dossierOpen = false)} />

<style>
	.governance-bar {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		background-color: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.gov-item {
		display: flex;
		align-items: flex-start;
		gap: 11px;
		padding: 13px 16px;
		border-right: 1px solid var(--border-subtle);
	}

	.gov-item:last-child {
		border-right: none;
	}

	.gov-icon {
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-subtle);
		background-color: var(--bg-surface-muted);
		color: var(--text-primary);
		display: grid;
		place-items: center;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.gov-icon-legal {
		background-color: var(--accent-legal-bg);
		border-color: var(--accent-legal-border);
		color: var(--accent-legal);
	}

	.gov-role {
		font-family: var(--font-mono);
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
	}

	.gov-desc {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 2px;
	}

	.two-col-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.nowrap-cell {
		white-space: nowrap;
	}

	.footprint-grid {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.footprint-lead {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.footprint-systems {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	@media (max-width: 1024px) {
		.governance-bar,
		.two-col-grid {
			grid-template-columns: 1fr;
		}

		.gov-item {
			border-right: none;
			border-bottom: 1px solid var(--border-subtle);
		}

		.gov-item:last-child {
			border-bottom: none;
		}
	}
</style>
