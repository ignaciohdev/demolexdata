<script lang="ts">
	import { resolve } from '$app/paths';
	import { Check, Layers, Building, ShieldCheck, ArrowUpRight } from 'lucide-svelte';
	import { BRAND_NAME } from '#lib/stores/lexdataStore.ts';

	const plans = [
		{
			id: 'pyme',
			tier: 'Nivel 01 · Base Normativa',
			name: 'Plan Pyme ("Cumplimiento Base")',
			recommended: false,
			tagline:
				'Estandarización documental esencial y captura lícita de clientes para pequeñas empresas.',
			idealFor: 'Empresas de hasta 25 trabajadores con un canal comercial principal.',
			deliverables: [
				'Levantamiento documental esencial y Matriz RAT inicial (Art. 14 ter)',
				'Reglamento Interno adaptado con cláusulas de higiene digital',
				'Portal de solicitudes de derechos ARSOPB con control de plazos',
				'Formulario web de Consentimiento Granular con prueba SHA-256',
				'Chequeo técnico automatizado trimestral de respaldos y cifrado'
			],
			governanceModel: 'Implementación Jurídica Estudio + Operación LexData'
		},
		{
			id: 'corporativo',
			tier: 'Nivel 02 · Estándar Institucional',
			name: 'Plan Corporativo ("Blindaje Total")',
			recommended: true,
			tagline:
				'Modelo integral de defensa jurídica, DPO Externo independiente y retención mediante monitoreo continuo.',
			idealFor:
				'Empresas medianas y constructoras (como Constructora Andes Sur SpA) con CRM y áreas operativas.',
			deliverables: [
				'Todo lo incluido en Plan Pyme ("Cumplimiento Base")',
				'DPO Externo Independiente asignado (separado de la implementación)',
				'Módulo de Traspaso de Responsabilidad y capacitación continua por puesto',
				'Canal de Brechas 72h con reloj regresivo y actas inmediatas a DPO + TI',
				'Sello Verificable QR activo vinculado a suscripción y Reporte Ejecutivo Mensual'
			],
			governanceModel: 'Independencia Legal: Estudio Jurídico + DPO Externo + LexData'
		},
		{
			id: 'holding',
			tier: 'Nivel 03 · Escala Multi-Sociedad',
			name: 'Plan Holding / Multi-RUT',
			recommended: false,
			tagline:
				'Consola corporativa centralizada para grupos empresariales y proveedores críticos regulados.',
			idealFor:
				'Holdings con múltiples razones sociales, contratistas del Estado o prestadores de Salud.',
			deliverables: [
				'Consola centralizada multi-RUT con matrices RAT segregadas por sociedad',
				'Gobierno de datos unificado y flujos de transferencia intragrupo auditados',
				'Monitoreo técnico continuo de alta frecuencia y bitácora consolidada',
				'Módulo compatible con Ley 21.663 de Ciberseguridad (proveedores del Estado / Salud)',
				'Simulador de Fiscalización por razón social y Dossier PDF ejecutivo consolidado'
			],
			governanceModel: 'Arquitectura Corporativa Multi-Entidad + Auditoría DPO de Grupo'
		}
	];

	const valuePillars = [
		{
			title: 'Ingreso Recurrente para el Estudio Jurídico',
			desc: 'Transforma la asesoría legal de proyecto único en una relación mensual continua respaldada por evidencia tecnológica.'
		},
		{
			title: 'Independencia de Roles Exigida por Ley 21.719',
			desc: 'Separa limpiamente la Implementación Jurídica (Estudio) del rol fiscalizador del DPO Externo Independiente.'
		},
		{
			title: 'Retención Automática vía Sello QR Activo',
			desc: 'El Sello Verificable QR exhibe vigencia en tiempo real; ante incumplimiento o mora, la certificación pública se suspende.'
		}
	];
</script>

<header class="page-header">
	<div>
		<div class="page-eyebrow">Modelo Comercial &amp; Escalamiento Institucional</div>
		<h1 class="page-title">Arquitectura de Planes y Escalamiento Comercial</h1>
		<p class="page-lead">
			Paquetes diseñados para comercialización conjunta entre el Estudio Jurídico y la plataforma
			{BRAND_NAME}, estructurados según exposición normativa y madurez operativa del cliente final.
		</p>
	</div>
</header>

<section class="plans-grid" aria-label="Paquetes comercializables">
	{#each plans as plan (plan.id)}
		<article class="plan-card" class:recommended={plan.recommended}>
			<div class="plan-top">
				<div class="plan-tier-row">
					<span class="font-mono plan-tier">{plan.tier}</span>
					{#if plan.recommended}
						<span class="badge badge-legal">Recomendado</span>
					{/if}
				</div>
				<h2 class="plan-name">{plan.name}</h2>
				<p class="plan-tagline">{plan.tagline}</p>
			</div>

			<div class="plan-target">
				<span class="target-label font-mono">Perfil de Cliente Final</span>
				<div>{plan.idealFor}</div>
			</div>

			<div class="plan-deliverables">
				<div class="target-label font-mono" style="margin-bottom: 10px;">
					Alcance y Entregables Incluidos
				</div>
				<ul>
					{#each plan.deliverables as item (item)}
						<li>
							<Check size={15} strokeWidth={1.5} color="#0F5132" style="flex-shrink: 0; margin-top: 2px;" />
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>

			<div class="plan-footer">
				<div class="gov-tag font-mono">{plan.governanceModel}</div>
			</div>
		</article>
	{/each}
</section>

<section class="card">
	<div class="card-header">
		<div>
			<h2 class="card-title">Lógica Económica y Jurídica del Modelo {BRAND_NAME}</h2>
			<p class="card-subtitle">
				Cómo la plataforma protege el estándar profesional del estudio jurídico y asegura continuidad
			</p>
		</div>
	</div>
	<div class="card-body pillars-grid">
		{#each valuePillars as pillar, idx (pillar.title)}
			<div class="pillar-item">
				<div class="pillar-icon">
					{#if idx === 0}
						<Layers size={17} strokeWidth={1.5} />
					{:else if idx === 1}
						<ShieldCheck size={17} strokeWidth={1.5} />
					{:else}
						<Building size={17} strokeWidth={1.5} />
					{/if}
				</div>
				<h3 class="pillar-title">{pillar.title}</h3>
				<p class="pillar-desc">{pillar.desc}</p>
			</div>
		{/each}
	</div>
</section>

<section class="card">
	<div class="card-body compatibility-strip">
		<div>
			<div class="font-mono" style="font-size: 10.5px; text-transform: uppercase; color: var(--text-secondary);">
				Extensión Regulatoria Integrada · Plan Holding / Multi-RUT
			</div>
			<div style="font-weight: 600; font-size: 15px; margin-top: 3px;">
				Convergencia Ley 21.719 (Datos Personales) + Ley 21.663 (Ley Marco de Ciberseguridad)
			</div>
			<p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
				Permite al Estudio ofrecer cumplimiento unificado a empresas proveedoras de servicios
				esenciales, organismos del Estado y prestadores de salud sin duplicar plataformas.
			</p>
		</div>
		<a href={resolve('/brechas-sello')} class="btn btn-secondary">
			<span>Ver Protocolo 72h &amp; Sello QR</span>
			<ArrowUpRight size={15} strokeWidth={1.5} />
		</a>
	</div>
</section>

<style>
	.plans-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
		align-items: stretch;
	}

	.plan-card {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
	}

	.plan-card.recommended {
		border-color: var(--accent-legal);
		border-top-width: 3px;
	}

	.plan-top {
		padding: 20px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.plan-tier-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 8px;
	}

	.plan-tier {
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
	}

	.plan-name {
		font-family: var(--font-serif);
		font-size: 21px;
		font-weight: 600;
		line-height: 1.2;
	}

	.plan-tagline {
		font-size: 13px;
		color: var(--text-secondary);
		margin-top: 8px;
	}

	.plan-target {
		padding: 14px 20px;
		background-color: var(--bg-surface-muted);
		border-bottom: 1px solid var(--border-subtle);
		font-size: 12.5px;
	}

	.target-label {
		display: block;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
		margin-bottom: 3px;
	}

	.plan-deliverables {
		padding: 18px 20px;
		flex: 1;
	}

	.plan-deliverables ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.plan-deliverables li {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		font-size: 13px;
		line-height: 1.4;
	}

	.plan-footer {
		padding: 13px 20px;
		border-top: 1px solid var(--border-subtle);
		background-color: var(--bg-surface-muted);
	}

	.gov-tag {
		font-size: 11px;
		color: var(--text-secondary);
	}

	.pillars-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
	}

	.pillar-item {
		padding: 14px 16px;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		background-color: var(--bg-surface-muted);
	}

	.pillar-icon {
		width: 30px;
		height: 30px;
		border-radius: var(--radius-sm);
		background-color: var(--accent-legal-bg);
		border: 1px solid var(--accent-legal-border);
		color: var(--accent-legal);
		display: grid;
		place-items: center;
		margin-bottom: 10px;
	}

	.pillar-title {
		font-family: var(--font-serif);
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 5px;
	}

	.pillar-desc {
		font-size: 12.5px;
		color: var(--text-secondary);
	}

	.compatibility-strip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		flex-wrap: wrap;
	}

	@media (max-width: 1100px) {
		.plans-grid,
		.pillars-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
