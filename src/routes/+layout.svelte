<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { LayoutProps } from './$types';
	import {
		Scale,
		LayoutDashboard,
		FileSignature,
		UserCheck,
		ShieldAlert,
		Layers,
		RotateCcw,
		Shield,
		Lock
	} from 'lucide-svelte';
	import { BRAND_NAME, lexdataMetrics, lexdataStore } from '#lib/stores/lexdataStore.ts';

	let { children }: LayoutProps = $props();

	let resetFeedback = $state(false);

	const navItems = [
		{
			href: '/' as const,
			label: 'Dashboard Ejecutivo',
			icon: LayoutDashboard
		},
		{
			href: '/comercial' as const,
			label: 'Portal Comercial & Consentimiento',
			icon: FileSignature
		},
		{
			href: '/trabajadores' as const,
			label: 'Higiene Digital & Responsabilidad',
			icon: UserCheck
		},
		{
			href: '/brechas-sello' as const,
			label: 'Canal Brechas 72h & Sello QR',
			icon: ShieldAlert
		},
		{
			href: '/planes' as const,
			label: 'Arquitectura de Planes',
			icon: Layers
		}
	];

	function isActiveRoute(href: string, routeId: string | null): boolean {
		if (!routeId) return false;
		if (href === '/') return routeId === '/';
		return routeId.startsWith(href);
	}

	function handleResetDemo() {
		lexdataStore.resetDemoData();
		resetFeedback = true;
		setTimeout(() => {
			resetFeedback = false;
		}, 2200);
	}
</script>

<div class="app-shell">
	<aside class="sidebar no-print" aria-label="Navegación principal">
		<div>
			<div class="sidebar-brand">
				<div class="brand-mark">
					<div class="brand-monogram">
						<Scale size={16} strokeWidth={1.5} />
					</div>
					<div>
						<div class="brand-name">{BRAND_NAME}</div>
					</div>
				</div>
				<div class="brand-subtitle">Gobierno de Datos · Ley 21.719</div>
			</div>

			<div class="sidebar-org">
				<div class="sidebar-org-label">Organización Auditada (Demo)</div>
				<div class="sidebar-org-name">{$lexdataStore.organization.name}</div>
				<div class="sidebar-org-meta tabular">
					RUT {$lexdataStore.organization.rut} · {$lexdataStore.organization.totalWorkers} trab.
				</div>
			</div>

			<nav class="sidebar-nav">
				<div class="nav-section-label">Módulos de Evidencia</div>
				{#each navItems as item (item.href)}
					{@const active = isActiveRoute(item.href, page.route.id)}
					{@const Icon = item.icon}
					<a
						href={resolve(item.href)}
						class="nav-link"
						class:active
						aria-current={active ? 'page' : undefined}
					>
						<Icon size={17} strokeWidth={1.5} />
						<span>{item.label}</span>
						{#if item.href === '/brechas-sello' && $lexdataMetrics.activeBreaches.length > 0}
							<span class="nav-link-badge tabular">{$lexdataMetrics.activeBreaches.length}</span>
						{/if}
					</a>
				{/each}
			</nav>
		</div>

		<div class="sidebar-footer">
			<div class="sidebar-status-line">
				<span>Estado Sello</span>
				<span class="font-mono" style="color: {$lexdataStore.subscriptionStatus === 'active' ? '#6EE7B7' : '#FCA5A5'};">
					{$lexdataStore.subscriptionStatus === 'active' ? 'ACTIVO' : 'SUSPENDIDO'}
				</span>
			</div>
			<button type="button" class="btn-reset-demo" onclick={handleResetDemo}>
				<RotateCcw size={14} strokeWidth={1.5} />
				<span>{resetFeedback ? 'Datos Demo Restaurados' : 'Restaurar Datos Demo'}</span>
			</button>
		</div>
	</aside>

	<div class="main-column">
		<header class="topbar no-print">
			<div class="topbar-context">
				<span class="topbar-crumb">{BRAND_NAME} // Evidencia Ley 21.719</span>
				<span class="topbar-divider"></span>
				<span class="topbar-entity">
					{$lexdataStore.organization.name} · {$lexdataStore.organization.systems.join(' & ')}
				</span>
			</div>

			<div class="topbar-controls">
				<div class="session-switcher" role="group" aria-label="Selector global de sesión">
					<button
						type="button"
						class="session-btn"
						class:active-dpo={$lexdataStore.sessionRole === 'dpo'}
						onclick={() => lexdataStore.setSessionRole('dpo')}
					>
						<Shield size={14} strokeWidth={1.5} />
						<span>Sesión: Gerencia / DPO Externo</span>
					</button>
					<button
						type="button"
						class="session-btn"
						class:active-comercial={$lexdataStore.sessionRole === 'comercial'}
						onclick={() => lexdataStore.setSessionRole('comercial')}
					>
						<Lock size={14} strokeWidth={1.5} />
						<span>Sesión: Ejecutivo Comercial (Restringida)</span>
					</button>
				</div>
			</div>
		</header>

		<main class="content-container">
			{@render children()}
		</main>
	</div>
</div>
