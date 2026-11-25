<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import {
		FileSignature,
		ShieldCheck,
		Download,
		Lock,
		PhoneCall,
		CheckCircle2,
		Hash,
		Globe,
		Clock,
		ArrowRight,
		AlertCircle
	} from 'lucide-svelte';
	import { lexdataStore } from '#lib/stores/lexdataStore.ts';
	import type { ProspectRecord } from '#lib/types/lexdata.ts';
	import { formatDateTimeCL, maskFullName, maskRut } from '#lib/utils/formatters.ts';

	let fullName = $state('');
	let rut = $state('');
	let phone = $state('');
	let email = $state('');

	// 3 autorizaciones independientes y NUNCA pre-marcadas
	let consentQuote = $state(false);
	let consentMarketing = $state(false);
	let consentFinancial = $state(false);

	let formError = $state('');
	let submitting = $state(false);
	let latestCertificate = $state<ProspectRecord | null>(null);
	let exportSuccessMessage = $state('');

	const isRestricted = $derived($lexdataStore.sessionRole === 'comercial');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		if (!fullName.trim() || !rut.trim() || !phone.trim() || !email.trim()) {
			formError = 'Complete todos los campos de identificación del titular para generar la evidencia.';
			return;
		}

		if (!consentQuote && !consentMarketing && !consentFinancial) {
			formError =
				'Por exigencia de la Ley 21.719, el titular debe seleccionar de forma expresa al menos una finalidad de tratamiento.';
			return;
		}

		submitting = true;
		try {
			const record = await lexdataStore.addProspect({
				fullName: fullName.trim(),
				rut: rut.trim(),
				phone: phone.trim(),
				email: email.trim(),
				consentQuote,
				consentMarketing,
				consentFinancial
			});
			latestCertificate = record;
			fullName = '';
			rut = '';
			phone = '';
			email = '';
			consentQuote = false;
			consentMarketing = false;
			consentFinancial = false;
		} finally {
			submitting = false;
		}
	}

	function handleFillSample() {
		fullName = 'Rodrigo Aravena Muñoz';
		rut = '17.654.320-9';
		phone = '+56 9 8234 5510';
		email = 'r.aravena@ejemplo-titular.cl';
		formError = '';
	}

	async function handleEncryptedCall(prospect: ProspectRecord) {
		await lexdataStore.registerEncryptedCall(prospect);
	}

	function handleExportCsv() {
		if (isRestricted) return;
		const headers = [
			'ID',
			'Nombre Completo',
			'RUT',
			'Telefono',
			'Correo',
			'Cotizacion',
			'Campanas',
			'Evaluacion Crediticia',
			'Timestamp ISO',
			'IP',
			'SHA-256'
		];
		const rows = $lexdataStore.prospects.map((p) => [
			p.id,
			`"${p.fullName}"`,
			p.rut,
			`"${p.phone}"`,
			p.email,
			p.consentQuote ? 'SI' : 'NO',
			p.consentMarketing ? 'SI' : 'NO',
			p.consentFinancial ? 'SI' : 'NO',
			p.timestampIso,
			p.ipAddress,
			p.sha256Hash
		]);
		const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `lexdata-base-auditada-${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		exportSuccessMessage = `Exportación auditada generada (${$lexdataStore.prospects.length} registros) bajo sesión Gerencia / DPO.`;
		setTimeout(() => {
			exportSuccessMessage = '';
		}, 4000);
	}
</script>

<header class="page-header">
	<div>
		<div class="page-eyebrow">Módulo Comercial · Consentimiento Expreso &amp; Enmascaramiento</div>
		<h1 class="page-title">Portal Comercial y Consentimiento Granular</h1>
		<p class="page-lead">
			Captura web sin casillas pre-marcadas con emisión instantánea de Prueba de Consentimiento
			SHA-256 y control de acceso por rol en cartera CRM.
		</p>
	</div>
	<div>
		<span class="badge {isRestricted ? 'badge-alert' : 'badge-legal'}">
			{#if isRestricted}
				<Lock size={13} strokeWidth={1.5} />
				Sesión Comercial Restringida (Datos Enmascarados)
			{:else}
				<ShieldCheck size={13} strokeWidth={1.5} />
				Sesión Gerencia / DPO (Acceso Auditado Total)
			{/if}
		</span>
	</div>
</header>

<div class="commercial-grid">
	<!-- Columna Izquierda: Formulario Web de Captación Granular -->
	<section class="card">
		<div class="card-header">
			<div>
				<h2 class="card-title">Formulario Web de Captación Granular</h2>
				<p class="card-subtitle">Paso a paso · Casillas independientes sin pre-selección</p>
			</div>
			<button type="button" class="btn btn-secondary btn-sm" onclick={handleFillSample}>
				Autocompletar Demo
			</button>
		</div>

		<div class="card-body">
			<form class="form-grid" onsubmit={handleSubmit}>
				<div class="step-label">
					<span class="step-num font-mono">01</span>
					<span>Identificación del Titular de Datos</span>
				</div>

				<div class="input-two-col">
					<div class="field">
						<label class="field-label" for="prospect-name">Nombre Completo</label>
						<input
							id="prospect-name"
							type="text"
							class="input"
							placeholder="Ej. María González Soto"
							bind:value={fullName}
						/>
					</div>

					<div class="field">
						<label class="field-label" for="prospect-rut">RUT</label>
						<input
							id="prospect-rut"
							type="text"
							class="input font-mono"
							placeholder="Ej. 16.482.910-4"
							bind:value={rut}
						/>
					</div>
				</div>

				<div class="input-two-col">
					<div class="field">
						<label class="field-label" for="prospect-phone">Teléfono</label>
						<input
							id="prospect-phone"
							type="tel"
							class="input font-mono"
							placeholder="Ej. +56 9 8412 3390"
							bind:value={phone}
						/>
					</div>

					<div class="field">
						<label class="field-label" for="prospect-email">Correo Electrónico</label>
						<input
							id="prospect-email"
							type="email"
							class="input"
							placeholder="titular@correo.cl"
							bind:value={email}
						/>
					</div>
				</div>

				<div class="step-label" style="margin-top: 6px;">
					<span class="step-num font-mono">02</span>
					<span>Autorizaciones Granulares Independientes (Sin Pre-Marcado)</span>
				</div>

				<label class="checkbox-card" class:checked={consentQuote}>
					<input type="checkbox" bind:checked={consentQuote} />
					<span>
						Autorizo el uso de mis datos exclusivamente para enviar la cotización solicitada
						<strong>(Ejecución precontractual).</strong>
					</span>
				</label>

				<label class="checkbox-card" class:checked={consentMarketing}>
					<input type="checkbox" bind:checked={consentMarketing} />
					<span>
						Acepto recibir campañas comerciales, promociones y novedades por correo o WhatsApp
						<strong>(Consentimiento expreso revocable).</strong>
					</span>
				</label>

				<label class="checkbox-card" class:checked={consentFinancial}>
					<input type="checkbox" bind:checked={consentFinancial} />
					<span>
						Autorizo compartir mis antecedentes con instituciones financieras para evaluación
						crediticia.
					</span>
				</label>

				{#if formError}
					<div class="alert-banner danger" transition:fade={{ duration: 150 }}>
						<div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
							<AlertCircle size={16} strokeWidth={1.5} />
							<span>{formError}</span>
						</div>
					</div>
				{/if}

				<div style="display: flex; justify-content: flex-end; padding-top: 4px;">
					<button type="submit" class="btn btn-primary" disabled={submitting}>
						<FileSignature size={16} strokeWidth={1.5} />
						<span>Registrar Prospecto y Emitir Certificado</span>
						<ArrowRight size={15} strokeWidth={1.5} />
					</button>
				</div>
			</form>

			{#if latestCertificate}
				<div class="certificate-card" transition:fly={{ y: 10, duration: 200 }}>
					<div class="cert-header">
						<div style="display: flex; align-items: center; gap: 8px;">
							<CheckCircle2 size={17} strokeWidth={1.5} color="#0F5132" />
							<strong>Certificado Digital de Consentimiento Emitido</strong>
						</div>
						<span class="badge badge-legal">Prueba Válida Art. 12</span>
					</div>

					<div class="cert-grid">
						<div>
							<span class="cert-label">Titular Registrado</span>
							<div>
								{isRestricted
									? maskFullName(latestCertificate.fullName)
									: latestCertificate.fullName}
							</div>
						</div>
						<div>
							<span class="cert-label">Timestamp ISO 8601</span>
							<div class="font-mono tabular">{latestCertificate.timestampIso}</div>
						</div>
						<div>
							<span class="cert-label">Dirección IP Origen</span>
							<div class="font-mono tabular">
								<Globe size={12} strokeWidth={1.5} style="display: inline; vertical-align: -2px;" />
								{latestCertificate.ipAddress}
							</div>
						</div>
						<div>
							<span class="cert-label">Finalidades Aceptadas</span>
							<div>
								{[
									latestCertificate.consentQuote ? 'Cotización' : null,
									latestCertificate.consentMarketing ? 'Campañas' : null,
									latestCertificate.consentFinancial ? 'Evaluación Crediticia' : null
								]
									.filter(Boolean)
									.join(' · ')}
							</div>
						</div>
					</div>

					<div class="cert-hash">
						<span class="cert-label">
							<Hash size={12} strokeWidth={1.5} style="display: inline; vertical-align: -2px;" />
							Huella Criptográfica SHA-256 Inmutable
						</span>
						<code class="font-mono">{latestCertificate.sha256Hash}</code>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Columna Derecha: Cartera de Prospectos con Enmascaramiento Dinámico -->
	<div class="right-stack">
		<section class="card">
			<div class="card-header">
				<div>
					<h2 class="card-title">Cartera de Prospectos CRM ({$lexdataStore.prospects.length})</h2>
					<p class="card-subtitle">
						{isRestricted
							? 'Política de minimización activa: apellidos y RUT enmascarados en sesión comercial'
							: 'Vista Gerencia / DPO con acceso íntegro y exportación con registro de auditoría'}
					</p>
				</div>

				{#if isRestricted}
					<button type="button" class="btn btn-secondary btn-sm" disabled>
						<Lock size={14} strokeWidth={1.5} />
						Exportar Base Auditada
					</button>
				{:else}
					<button type="button" class="btn btn-primary btn-sm" onclick={handleExportCsv}>
						<Download size={14} strokeWidth={1.5} />
						Exportar Base Auditada
					</button>
				{/if}
			</div>

			{#if isRestricted}
				<div class="restricted-notice">
					<Lock size={15} strokeWidth={1.5} />
					<span>Descarga bloqueada por Política de Seguridad Ley 21.719</span>
				</div>
			{/if}

			{#if exportSuccessMessage}
				<div class="export-toast" transition:fade={{ duration: 150 }}>
					<CheckCircle2 size={15} strokeWidth={1.5} />
					<span>{exportSuccessMessage}</span>
				</div>
			{/if}

			<div class="table-wrap">
				<table class="data-table">
					<thead>
						<tr>
							<th>Titular / RUT</th>
							<th>Contacto</th>
							<th>Consentimiento</th>
							<th>Evidencia</th>
						</tr>
					</thead>
					<tbody>
						{#each $lexdataStore.prospects as prospect (prospect.id)}
							<tr>
								<td>
									<div style="font-weight: 600;">
										{isRestricted ? maskFullName(prospect.fullName) : prospect.fullName}
									</div>
									<div class="font-mono tabular" style="font-size: 11.5px; color: var(--text-secondary);">
										{isRestricted ? maskRut(prospect.rut) : prospect.rut}
									</div>
								</td>
								<td>
									{#if isRestricted}
										<button
											type="button"
											class="btn btn-secondary btn-sm"
											onclick={() => handleEncryptedCall(prospect)}
										>
											<PhoneCall size={13} strokeWidth={1.5} />
											Llamar vía Central Encriptada
										</button>
									{:else}
										<div class="font-mono tabular" style="font-size: 12px;">{prospect.phone}</div>
										<div style="font-size: 11.5px; color: var(--text-secondary);">{prospect.email}</div>
									{/if}
								</td>
								<td>
									<div class="consent-pills">
										{#if prospect.consentQuote}
											<span class="badge badge-legal">Cotización</span>
										{/if}
										{#if prospect.consentMarketing}
											<span class="badge badge-neutral">Campañas</span>
										{/if}
										{#if prospect.consentFinancial}
											<span class="badge badge-alert">Crédito</span>
										{/if}
									</div>
								</td>
								<td>
									<div class="font-mono tabular" style="font-size: 11px; color: var(--text-secondary);">
										{prospect.sha256Hash.slice(0, 12)}…
									</div>
									<div style="font-size: 11px; color: var(--text-muted);">
										IP {prospect.ipAddress}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<section class="card">
			<div class="card-header">
				<div>
					<h2 class="card-title">Registro Auditado de Llamadas (Central Encriptada)</h2>
					<p class="card-subtitle">
						Cada contacto comercial sin exposición de número queda estampado para fiscalización
					</p>
				</div>
				<span class="badge badge-neutral tabular">{$lexdataStore.callLogs.length} eventos</span>
			</div>
			<div class="card-body">
				<ul class="call-log-list">
					{#each $lexdataStore.callLogs as log (log.id)}
						<li class="call-log-item" transition:fade={{ duration: 150 }}>
							<div>
								<strong>{log.prospectLabel}</strong>
								<span class="call-channel"> · {log.channel}</span>
								<div style="font-size: 11.5px; color: var(--text-secondary);">
									{log.operatorRole}
								</div>
							</div>
							<div style="text-align: right;">
								<div class="font-mono tabular" style="font-size: 11.5px;">
									<Clock size={11} strokeWidth={1.5} style="display: inline; vertical-align: -1px;" />
									{formatDateTimeCL(log.timestampIso)}
								</div>
								<div class="font-mono" style="font-size: 11px; color: var(--accent-legal);">
									REF #{log.auditHash}
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</section>
	</div>
</div>

<style>
	.commercial-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.02fr) minmax(0, 1.18fr);
		gap: 20px;
		align-items: start;
	}

	.right-stack {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.step-label {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 12.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
		padding-bottom: 4px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.step-num {
		font-size: 11px;
		padding: 2px 6px;
		background-color: var(--bg-canvas);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
	}

	.input-two-col {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.certificate-card {
		margin-top: 18px;
		padding: 16px;
		background-color: var(--accent-legal-bg);
		border: 1px solid var(--accent-legal-border);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.cert-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		flex-wrap: wrap;
	}

	.cert-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px 14px;
		font-size: 12.5px;
	}

	.cert-label {
		display: block;
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
		margin-bottom: 2px;
	}

	.cert-hash {
		padding: 9px 10px;
		background-color: #ffffff;
		border: 1px solid var(--accent-legal-border);
		border-radius: var(--radius-sm);
	}

	.cert-hash code {
		display: block;
		font-size: 11.5px;
		word-break: break-all;
		color: var(--text-primary);
	}

	.restricted-notice {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		background-color: var(--accent-alert-bg);
		border-bottom: 1px solid var(--accent-alert-border);
		color: var(--accent-alert);
		font-size: 12.5px;
		font-weight: 600;
	}

	.export-toast {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		background-color: var(--accent-legal-bg);
		border-bottom: 1px solid var(--accent-legal-border);
		color: var(--accent-legal);
		font-size: 12.5px;
		font-weight: 600;
	}

	.consent-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.call-log-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.call-log-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--border-subtle);
		font-size: 12.5px;
	}

	.call-log-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.call-channel {
		color: var(--accent-legal);
		font-weight: 500;
	}

	@media (max-width: 1120px) {
		.commercial-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.input-two-col,
		.cert-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
