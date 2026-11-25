<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Printer, X, ShieldCheck, FileCheck2 } from 'lucide-svelte';
	import { BRAND_NAME, lexdataMetrics, lexdataStore } from '#lib/stores/lexdataStore.ts';
	import { formatDateTimeCL } from '#lib/utils/formatters.ts';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();

	const generatedAt = $derived(formatDateTimeCL(new Date().toISOString()));

	function handlePrint() {
		if (typeof window !== 'undefined') {
			window.print();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if open}
	<div
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		aria-labelledby="dossier-title"
		tabindex="-1"
		transition:fade={{ duration: 150 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
	>
		<div class="modal-sheet" transition:fly={{ y: 12, duration: 180 }}>
			<div class="modal-toolbar no-print">
				<div class="toolbar-meta">
					<FileCheck2 size={16} strokeWidth={1.5} />
					<span>Vista Oficial Imprimible — Dossier de Fiscalización Agencia de Protección de Datos</span>
				</div>
				<div class="toolbar-actions">
					<button type="button" class="btn btn-primary btn-sm" onclick={handlePrint}>
						<Printer size={15} strokeWidth={1.5} />
						Imprimir / Guardar PDF
					</button>
					<button type="button" class="btn btn-secondary btn-sm" onclick={onClose}>
						<X size={15} strokeWidth={1.5} />
						Cerrar
					</button>
				</div>
			</div>

			<div class="modal-scroll">
				<article class="dossier-doc">
					<header class="dossier-header">
						<div>
							<p class="dossier-kicker">
								REPORTE EJECUTIVO DE EVIDENCIA · LEY N° 21.719 (CHILE)
							</p>
							<h2 id="dossier-title" class="dossier-title">
								Dossier Oficial de Cumplimiento y Licitud de Tratamiento
							</h2>
							<p class="dossier-subtitle">
								Emitido por plataforma {BRAND_NAME} para exhibición ante la Agencia de Protección de Datos Personales
							</p>
						</div>
						<div class="dossier-stamp">
							<div class="stamp-status" class:suspended={$lexdataStore.subscriptionStatus === 'suspended'}>
								<ShieldCheck size={16} strokeWidth={1.5} />
								<span>{$lexdataMetrics.complianceBadge}</span>
							</div>
							<div class="stamp-code font-mono tabular">
								FOL-{$lexdataMetrics.verificationSealHash.toUpperCase()}
							</div>
						</div>
					</header>

					<section class="dossier-meta-grid">
						<div class="meta-box">
							<span class="meta-label">Organización Auditada</span>
							<strong>{$lexdataStore.organization.name}</strong>
							<span class="font-mono tabular">RUT: {$lexdataStore.organization.rut}</span>
						</div>
						<div class="meta-box">
							<span class="meta-label">Índice de Cumplimiento Vigente</span>
							<strong class="tabular">{$lexdataMetrics.complianceIndex}% ({$lexdataMetrics.fineExposureLabel})</strong>
							<span>{$lexdataMetrics.compliantWorkersCount} de {$lexdataStore.organization.totalWorkers} trabajadores acreditados</span>
						</div>
						<div class="meta-box">
							<span class="meta-label">Gobernanza Independiente</span>
							<strong>DPO Externo Independiente</strong>
							<span>Emisión: {generatedAt}</span>
						</div>
					</section>

					<section class="dossier-section">
						<h3>1. Estado de Licitud y Matriz RAT (Art. 14 ter)</h3>
						<p class="dossier-lead">
							La organización mantiene inventariadas sus actividades de tratamiento con base de licitud acreditada, finalidad determinada y plazos legales de conservación definidos:
						</p>
						<table class="dossier-table">
							<thead>
								<tr>
									<th>Base de Datos</th>
									<th>Base de Licitud</th>
									<th>Plazo Legal de Retención</th>
									<th>Control Técnico</th>
								</tr>
							</thead>
							<tbody>
								{#each $lexdataStore.ratMatrix as row (row.id)}
									<tr>
										<td><strong>{row.databaseName}</strong></td>
										<td>{row.lawfulBasis}</td>
										<td>{row.retentionPeriod}</td>
										<td>{row.securityControl}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</section>

					<section class="dossier-section">
						<h3>2. Trazabilidad Probatoria de Consentimientos</h3>
						<p class="dossier-lead">
							Los formularios comerciales exigen autorizaciones granulares independientes sin casillas pre-marcadas, generando prueba de consentimiento con estampado de tiempo ISO, dirección IP y huella criptográfica SHA-256:
						</p>
						<table class="dossier-table">
							<thead>
								<tr>
									<th>Fecha / Hora ISO</th>
									<th>Finalidades Autorizadas</th>
									<th>IP Origen</th>
									<th>Huella SHA-256</th>
								</tr>
							</thead>
							<tbody>
								{#each $lexdataStore.prospects.slice(0, 5) as prospect (prospect.id)}
									<tr>
										<td class="font-mono tabular">{prospect.timestampIso}</td>
										<td>
											{[
												prospect.consentQuote ? 'Cotización' : null,
												prospect.consentMarketing ? 'Campañas' : null,
												prospect.consentFinancial ? 'Evaluación Crediticia' : null
											]
												.filter(Boolean)
												.join(' · ') || 'Sin autorizaciones'}
										</td>
										<td class="font-mono tabular">{prospect.ipAddress}</td>
										<td class="font-mono">{prospect.sha256Hash.slice(0, 20)}…</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</section>

					<section class="dossier-section dossier-two-col">
						<div class="sub-box">
							<h3>3. Capacitaciones Firmadas y Traspaso de Responsabilidad</h3>
							<p>
								A la fecha de emisión, <strong>{$lexdataMetrics.compliantWorkersCount} de {$lexdataStore.organization.totalWorkers} trabajadores</strong> ({$lexdataMetrics.coveragePercent}%) registran capacitación aprobada y protocolo de higiene digital suscrito, acreditando diligencia debida y deber de supervisión organizacional.
							</p>
						</div>
						<div class="sub-box">
							<h3>4. Resultado de Pruebas de Seguridad Mensuales</h3>
							<ul class="checks-list">
								{#each $lexdataStore.technicalChecks as check (check.id)}
									<li>
										<span>{check.name}</span>
										<strong>{check.result}</strong>
									</li>
								{/each}
							</ul>
						</div>
					</section>

					<section class="dossier-section">
						<h3>5. Registro Probatorio de Supresiones y Revocaciones (Art. 7)</h3>
						<p class="dossier-lead">
							Certificados inmutables que acreditan la eliminación definitiva de datos identificatorios en bases comerciales ante solicitud del titular, conservando resguardo legal únicamente en bases obligatorias:
						</p>
						<table class="dossier-table">
							<thead>
								<tr>
									<th>Certificado</th>
									<th>Titular Anonimizado</th>
									<th>Alcance y Resolución Legal</th>
									<th>Fecha ISO</th>
									<th>Huella SHA-256</th>
								</tr>
							</thead>
							<tbody>
								{#each $lexdataStore.suppressions.slice(0, 5) as sup (sup.id)}
									<tr>
										<td class="font-mono tabular">{sup.code}</td>
										<td class="font-mono tabular">{sup.titularMasked}</td>
										<td>{sup.legalBasisResolution}</td>
										<td class="font-mono tabular">{sup.executedAtIso}</td>
										<td class="font-mono">{sup.erasureSha256.slice(0, 18)}…</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</section>

					<footer class="dossier-footer">
						<div>
							<strong>Implementación Jurídica:</strong> {$lexdataStore.governance.legalImplementation}
						</div>
						<div>
							<strong>Fiscalización Independiente:</strong> {$lexdataStore.governance.externalDpo}
						</div>
						<div>
							<strong>Evidencia Tecnológica:</strong> {$lexdataStore.governance.techOperation}
						</div>
					</footer>
				</article>
			</div>
		</div>
	</div>
{/if}

<style>
	.toolbar-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.dossier-doc {
		display: flex;
		flex-direction: column;
		gap: 20px;
		color: var(--text-primary);
	}

	.dossier-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
		padding-bottom: 16px;
		border-bottom: 2px solid var(--text-primary);
	}

	.dossier-kicker {
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
		margin-bottom: 4px;
	}

	.dossier-title {
		font-family: var(--font-serif);
		font-size: 24px;
		font-weight: 600;
		line-height: 1.2;
	}

	.dossier-subtitle {
		font-size: 12.5px;
		color: var(--text-secondary);
		margin-top: 4px;
	}

	.dossier-stamp {
		text-align: right;
		flex-shrink: 0;
	}

	.stamp-status {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 10px;
		border: 1px solid var(--accent-legal-border);
		background-color: var(--accent-legal-bg);
		color: var(--accent-legal);
		border-radius: var(--radius-sm);
		font-size: 12px;
		font-weight: 600;
	}

	.stamp-status.suspended {
		border-color: var(--accent-danger-border);
		background-color: var(--accent-danger-bg);
		color: var(--accent-danger);
	}

	.stamp-code {
		font-size: 11px;
		color: var(--text-secondary);
		margin-top: 5px;
	}

	.dossier-meta-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
	}

	.meta-box {
		padding: 12px 14px;
		border-right: 1px solid var(--border-subtle);
		display: flex;
		flex-direction: column;
		gap: 3px;
		font-size: 12.5px;
	}

	.meta-box:last-child {
		border-right: none;
	}

	.meta-label {
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
	}

	.dossier-section h3 {
		font-family: var(--font-serif);
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 6px;
	}

	.dossier-lead {
		font-size: 12.5px;
		color: var(--text-secondary);
		margin-bottom: 10px;
	}

	.dossier-table {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid var(--border-subtle);
		font-size: 12px;
	}

	.dossier-table th {
		text-align: left;
		padding: 8px 10px;
		background-color: var(--bg-surface-muted);
		border-bottom: 1px solid var(--border-subtle);
		font-family: var(--font-mono);
		font-size: 10.5px;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.dossier-table td {
		padding: 8px 10px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.dossier-two-col {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.sub-box {
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		padding: 14px;
		font-size: 12.5px;
	}

	.checks-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.checks-list li {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		padding-bottom: 5px;
		border-bottom: 1px dashed var(--border-subtle);
		font-size: 12px;
	}

	.checks-list li:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.checks-list strong {
		color: var(--accent-legal);
		white-space: nowrap;
	}

	.dossier-footer {
		padding-top: 12px;
		border-top: 1px solid var(--border-subtle);
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
		font-size: 11.5px;
		color: var(--text-secondary);
	}

	@media (max-width: 720px) {
		.dossier-header,
		.dossier-meta-grid,
		.dossier-two-col,
		.dossier-footer {
			grid-template-columns: 1fr;
			flex-direction: column;
		}
	}
</style>
