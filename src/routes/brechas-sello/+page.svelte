<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import {
		ShieldAlert,
		Clock,
		CheckCircle2,
		Send,
		ShieldCheck,
		ShieldOff,
		AlertTriangle,
		BellRing
	} from 'lucide-svelte';
	import { lexdataMetrics, lexdataStore } from '#lib/stores/lexdataStore.ts';
	import type { BreachType } from '#lib/types/lexdata.ts';
	import { formatCountdown, formatDateTimeCL } from '#lib/utils/formatters.ts';
	import QrSealSvg from '#lib/components/QrSealSvg.svelte';

	let incidentType = $state<BreachType>('Extravío de dispositivo');
	let description = $state('');
	let formError = $state('');
	let nowMs = $state(Date.now());

	$effect(() => {
		const interval = setInterval(() => {
			nowMs = Date.now();
		}, 1000);
		return () => clearInterval(interval);
	});

	const activeAlert = $derived($lexdataMetrics.activeBreaches[0] ?? null);
	const isSuspended = $derived($lexdataStore.subscriptionStatus === 'suspended');

	async function handleReportBreach(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		if (!description.trim()) {
			formError = 'Describa brevemente el incidente para activar el protocolo de 72 horas.';
			return;
		}

		await lexdataStore.reportBreach(incidentType, description);
		description = '';
	}

	function fillSampleBreach() {
		incidentType = 'Envío erróneo de destinatarios';
		description =
			'Ejecutivo adjuntó planilla parcial de postventa con RUT de 12 propietarios a un destinatario externo fuera del dominio corporativo.';
		formError = '';
	}
</script>

<header class="page-header">
	<div>
		<div class="page-eyebrow">
			Respuesta a Incidentes (Art. 14 sexies) &amp; Certificación Verificable
		</div>
		<h1 class="page-title">Canal de Brechas (72h) y Sello Verificable QR</h1>
		<p class="page-lead">
			Trazabilidad de notificación temprana ante la Agencia de Protección de Datos y control de
			vigencia mensual del Sello Institucional.
		</p>
	</div>
</header>

{#if activeAlert}
	<section class="breach-banner" role="alert" transition:fly={{ y: -8, duration: 200 }}>
		<div class="breach-banner-left">
			<div class="breach-icon-box">
				<AlertTriangle size={20} strokeWidth={1.5} />
			</div>
			<div>
				<div class="breach-kicker font-mono">
					ALERTA CRÍTICA ACTIVA · FOLIO {activeAlert.code} · {activeAlert.type.toUpperCase()}
				</div>
				<h2 class="breach-banner-title">
					Ventana Legal de Notificación a la Agencia en Curso (72 Horas)
				</h2>
				<p class="breach-banner-desc">{activeAlert.description}</p>
				<div class="notification-receipts">
					<span class="receipt-chip">
						<BellRing size={12} strokeWidth={1.5} />
						Notificación inmediata enviada a <strong>DPO Externo (Independiente)</strong>:
						<span class="font-mono tabular">{formatDateTimeCL(activeAlert.notifiedDpoAtIso)}</span>
					</span>
					<span class="receipt-chip">
						<BellRing size={12} strokeWidth={1.5} />
						Notificación inmediata enviada a <strong>Encargado Interno TI</strong>:
						<span class="font-mono tabular">{formatDateTimeCL(activeAlert.notifiedTiAtIso)}</span>
					</span>
				</div>
			</div>
		</div>

		<div class="breach-countdown-box">
			<span class="countdown-label font-mono">TIEMPO RESTANTE 72H</span>
			<div class="countdown-clock font-mono tabular">
				{formatCountdown(activeAlert.deadlineAtMs - nowMs)}
			</div>
			<button
				type="button"
				class="btn btn-secondary btn-sm"
				onclick={() => lexdataStore.resolveBreach(activeAlert.id)}
			>
				Marcar Incidente Contenido
			</button>
		</div>
	</section>
{/if}

<!-- Bloque Superior: Canal de Denuncias y Brechas de Seguridad -->
<section class="breaches-grid">
	<div class="card">
		<div class="card-header">
			<div>
				<h2 class="card-title">Reportar Incidente o Brecha de Seguridad</h2>
				<p class="card-subtitle">
					Escalamiento automático al DPO Externo Independiente y al Encargado Interno TI
				</p>
			</div>
			<button type="button" class="btn btn-secondary btn-sm" onclick={fillSampleBreach}>
				Cargar Caso Demo
			</button>
		</div>

		<div class="card-body">
			<form class="form-grid" onsubmit={handleReportBreach}>
				<div class="field">
					<label class="field-label" for="breach-type">Tipología del Incidente</label>
					<select id="breach-type" class="select" bind:value={incidentType}>
						<option value="Extravío de dispositivo">Extravío de dispositivo</option>
						<option value="Envío erróneo de destinatarios">Envío erróneo de destinatarios</option>
						<option value="Acceso no autorizado">Acceso no autorizado</option>
					</select>
				</div>

				<div class="field">
					<label class="field-label" for="breach-desc">
						Descripción Ejecutiva de los Hechos y Datos Afectados
					</label>
					<textarea
						id="breach-desc"
						rows="4"
						class="textarea"
						placeholder="Indique sistema involucrado (Libro de Obras o CRM), volumen estimado de titulares y hora de detección..."
						bind:value={description}
					></textarea>
				</div>

				{#if formError}
					<div class="alert-banner danger" transition:fade={{ duration: 150 }}>
						<span>{formError}</span>
					</div>
				{/if}

				<div style="display: flex; justify-content: flex-end;">
					<button type="submit" class="btn btn-danger">
						<Send size={15} strokeWidth={1.5} />
						Activar Protocolo 72h y Notificar DPO + TI
					</button>
				</div>
			</form>
		</div>
	</div>

	<div class="card">
		<div class="card-header">
			<div>
				<h2 class="card-title">Bitácora de Incidentes y Comprobantes</h2>
				<p class="card-subtitle">Evidencia cronológica de reacción oportuna</p>
			</div>
			<span class="badge badge-neutral tabular">{$lexdataStore.breaches.length} registros</span>
		</div>

		<div class="card-body">
			{#if $lexdataStore.breaches.length === 0}
				<div class="empty-breaches">
					<ShieldCheck size={24} strokeWidth={1.5} color="#0F5132" />
					<div>
						<strong>Sin brechas de seguridad activas</strong>
						<p>
							Registre un incidente de prueba en el formulario izquierdo para demostrar el reloj
							regresivo de 72 horas y el comprobante de notificación al DPO Externo.
						</p>
					</div>
				</div>
			{:else}
				<ul class="breach-history">
					{#each $lexdataStore.breaches as item (item.id)}
						<li class="breach-history-item" transition:fade={{ duration: 150 }}>
							<div class="history-top">
								<div>
									<span class="font-mono" style="font-size: 11px; color: var(--text-secondary);">
										{item.code}
									</span>
									<strong style="margin-left: 6px;">{item.type}</strong>
								</div>
								<span
									class="badge {item.status === 'Alerta 72h Activa'
										? 'badge-danger'
										: 'badge-legal'}"
								>
									{item.status}
								</span>
							</div>
							<p class="history-desc">{item.description}</p>
							<div class="history-meta font-mono tabular">
								<span>Reportado: {formatDateTimeCL(item.reportedAtIso)}</span>
								<span>Hash Comprobante: {item.receiptHash}</span>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</section>

<!-- Bloque Inferior: Sello Digital Verificable y Control de Retención Mensual -->
<section class="card seal-section" class:seal-suspended={isSuspended}>
	<div class="card-header">
		<div>
			<h2 class="card-title">Sello Digital Verificable y Control de Retención Mensual</h2>
			<p class="card-subtitle">
				Mecanismo comercial de retención recurrente: la vigencia pública del sello depende de
				mantener la suscripción y el monitoreo técnico mensual al día.
			</p>
		</div>

		<div class="subscription-toggle" role="group" aria-label="Interruptor de estado de suscripción mensual">
			<span class="toggle-caption">Estado de Suscripción Mensual:</span>
			<button
				type="button"
				class="sub-btn"
				class:sub-active={!isSuspended}
				onclick={() => lexdataStore.setSubscriptionStatus('active')}
			>
				<CheckCircle2 size={14} strokeWidth={1.5} />
				Al Día (Activo)
			</button>
			<button
				type="button"
				class="sub-btn"
				class:sub-suspended={isSuspended}
				onclick={() => lexdataStore.setSubscriptionStatus('suspended')}
			>
				<ShieldOff size={14} strokeWidth={1.5} />
				En Mora (Suspendido)
			</button>
		</div>
	</div>

	<div class="card-body seal-card-body">
		<div class="seal-visual-box" class:is-suspended={isSuspended}>
			<QrSealSvg
				suspended={isSuspended}
				seed={`LEXDATA-${$lexdataStore.organization.rut}-${$lexdataStore.subscriptionStatus}`}
				size={146}
			/>
			<div class="seal-qr-caption font-mono tabular">
				VERIFY · #{$lexdataMetrics.verificationSealHash.toUpperCase()}
			</div>
		</div>

		<div class="seal-details">
			<div class="seal-status-row">
				{#if isSuspended}
					<span class="badge badge-danger">
						<ShieldOff size={14} strokeWidth={1.5} />
						Certificación Suspendida — Monitoreo Técnico Detenido
					</span>
				{:else}
					<span class="badge badge-legal">
						<ShieldCheck size={14} strokeWidth={1.5} />
						Empresa Auditada Ley 21.719 — Vigente
					</span>
				{/if}
			</div>

			<h3 class="seal-org-title">
				{#if isSuspended}
					Sello Público Inhabilitado por Mora en Suscripción Mensual
				{:else}
					Sello Oficial "Empresa Auditada Ley 21.719"
				{/if}
			</h3>

			<p class="seal-description">
				{#if isSuspended}
					Al escanear el código QR desde un sitio web, cotización o firma de correo, terceros y
					fiscalizadores visualizarán la advertencia de <strong>Certificación Suspendida — Monitoreo Técnico Detenido</strong> hasta regularizar el servicio de verificación continua y DPO Externo.
				{:else}
					Acredita ante clientes, bancos, proveedores del Estado y la Agencia de Protección de Datos
					que <strong>{$lexdataStore.organization.name}</strong> mantiene verificación técnica
					mensual activa, DPO Externo independiente y matriz RAT vigente.
				{/if}
			</p>

			<div class="seal-meta-strip">
				<div>
					<span class="meta-kicker font-mono">Titular del Sello</span>
					<div>{$lexdataStore.organization.name}</div>
				</div>
				<div>
					<span class="meta-kicker font-mono">RUT Institucional</span>
					<div class="font-mono tabular">{$lexdataStore.organization.rut}</div>
				</div>
				<div>
					<span class="meta-kicker font-mono">Índice Asociado</span>
					<div class="font-mono tabular">{$lexdataMetrics.complianceIndex}%</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.breach-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 18px 22px;
		background-color: var(--accent-danger-bg);
		border: 1px solid var(--accent-danger-border);
		border-left: 4px solid var(--accent-danger);
		border-radius: var(--radius-md);
		color: var(--text-primary);
	}

	.breach-banner-left {
		display: flex;
		align-items: flex-start;
		gap: 14px;
	}

	.breach-icon-box {
		width: 38px;
		height: 38px;
		border-radius: var(--radius-sm);
		background-color: var(--accent-danger);
		color: #ffffff;
		display: grid;
		place-items: center;
		flex-shrink: 0;
	}

	.breach-kicker {
		font-size: 11px;
		font-weight: 600;
		color: var(--accent-danger);
		letter-spacing: 0.05em;
	}

	.breach-banner-title {
		font-family: var(--font-serif);
		font-size: 20px;
		font-weight: 600;
		margin-top: 2px;
	}

	.breach-banner-desc {
		font-size: 13px;
		color: var(--text-secondary);
		margin-top: 4px;
	}

	.notification-receipts {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 10px;
	}

	.receipt-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 9px;
		background-color: #ffffff;
		border: 1px solid var(--accent-danger-border);
		border-radius: var(--radius-sm);
		font-size: 11.5px;
		color: var(--text-primary);
	}

	.breach-countdown-box {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		flex-shrink: 0;
		padding-left: 20px;
		border-left: 1px solid var(--accent-danger-border);
	}

	.countdown-label {
		font-size: 10.5px;
		color: var(--accent-danger);
		letter-spacing: 0.08em;
	}

	.countdown-clock {
		font-size: 30px;
		font-weight: 500;
		line-height: 1;
		color: var(--accent-danger);
	}

	.breaches-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		align-items: start;
	}

	.empty-breaches {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 18px;
		background-color: var(--bg-surface-muted);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
	}

	.empty-breaches p {
		font-size: 12.5px;
		color: var(--text-secondary);
		margin-top: 4px;
	}

	.breach-history {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.breach-history-item {
		padding: 12px 14px;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		background-color: var(--bg-surface-muted);
	}

	.history-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.history-desc {
		font-size: 12.5px;
		color: var(--text-secondary);
		margin: 6px 0;
	}

	.history-meta {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		flex-wrap: wrap;
		font-size: 11px;
		color: var(--text-muted);
	}

	.subscription-toggle {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.toggle-caption {
		font-size: 12px;
		font-weight: 600;
		color: var(--text-secondary);
		margin-right: 4px;
	}

	.sub-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 11px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-subtle);
		background-color: var(--bg-canvas);
		color: var(--text-secondary);
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.sub-btn.sub-active {
		background-color: var(--accent-legal-bg);
		border-color: var(--accent-legal-border);
		color: var(--accent-legal);
	}

	.sub-btn.sub-suspended {
		background-color: var(--accent-danger-bg);
		border-color: var(--accent-danger-border);
		color: var(--accent-danger);
	}

	.seal-section.seal-suspended {
		border-color: var(--accent-danger-border);
	}

	.seal-card-body {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 28px;
		align-items: center;
	}

	.seal-visual-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 16px;
		background-color: var(--bg-surface-muted);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
	}

	.seal-visual-box.is-suspended {
		background-color: #F4F2EE;
		border-color: var(--accent-danger-border);
	}

	.seal-qr-caption {
		font-size: 10.5px;
		color: var(--text-secondary);
	}

	.seal-details {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.seal-org-title {
		font-family: var(--font-serif);
		font-size: 22px;
		font-weight: 600;
	}

	.seal-description {
		font-size: 13.5px;
		color: var(--text-secondary);
		max-width: 720px;
	}

	.seal-meta-strip {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		padding-top: 12px;
		margin-top: 4px;
		border-top: 1px solid var(--border-subtle);
		font-size: 13px;
		font-weight: 600;
	}

	.meta-kicker {
		display: block;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
		font-weight: 500;
		margin-bottom: 2px;
	}

	@media (max-width: 1024px) {
		.breach-banner {
			flex-direction: column;
			align-items: flex-start;
		}

		.breach-countdown-box {
			align-items: flex-start;
			padding-left: 0;
			border-left: none;
			border-top: 1px solid var(--accent-danger-border);
			padding-top: 12px;
			width: 100%;
		}

		.breaches-grid,
		.seal-card-body {
			grid-template-columns: 1fr;
		}

		.seal-meta-strip {
			grid-template-columns: 1fr;
		}
	}
</style>
