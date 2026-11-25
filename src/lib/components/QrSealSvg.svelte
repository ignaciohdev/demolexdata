<script lang="ts">
	interface Props {
		suspended?: boolean;
		seed?: string;
		size?: number;
	}

	let { suspended = false, seed = 'LEXDATA-76543210-8', size = 136 }: Props = $props();

	const GRID_SIZE = 21;

	function isFinderModule(r: number, c: number): boolean {
		const inTopLeft = r < 7 && c < 7;
		const inTopRight = r < 7 && c >= GRID_SIZE - 7;
		const inBottomLeft = r >= GRID_SIZE - 7 && c < 7;
		return inTopLeft || inTopRight || inBottomLeft;
	}

	function finderPixel(r: number, c: number): boolean {
		const lr = r >= GRID_SIZE - 7 ? r - (GRID_SIZE - 7) : r;
		const lc = c >= GRID_SIZE - 7 ? c - (GRID_SIZE - 7) : c;
		if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
		if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
		return false;
	}

	const matrix = $derived.by(() => {
		const cells: { r: number; c: number }[] = [];
		let hash = 2166136261;
		for (let i = 0; i < seed.length; i++) {
			hash ^= seed.charCodeAt(i);
			hash = Math.imul(hash, 16777619);
		}

		for (let r = 0; r < GRID_SIZE; r++) {
			for (let c = 0; c < GRID_SIZE; c++) {
				if (isFinderModule(r, c)) {
					if (finderPixel(r, c)) cells.push({ r, c });
					continue;
				}
				if (
					(r === 7 && c < 8) ||
					(c === 7 && r < 8) ||
					(r === 7 && c >= GRID_SIZE - 8) ||
					(c === 7 && r >= GRID_SIZE - 8) ||
					(r === GRID_SIZE - 8 && c < 8)
				) {
					continue;
				}
				if (r === 6 || c === 6) {
					if ((r + c) % 2 === 0) cells.push({ r, c });
					continue;
				}
				const bit = ((hash ^ (r * 31 + c * 17) ^ (r * c * 13)) >>> ((r + c) % 7)) & 1;
				if (bit === 1) cells.push({ r, c });
			}
		}
		return cells;
	});
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 {GRID_SIZE} {GRID_SIZE}"
	role="img"
	aria-label={suspended
		? 'Código QR de certificación suspendida'
		: 'Código QR verificable Empresa Auditada Ley 21.719'}
	class="qr-svg"
	class:is-suspended={suspended}
>
	<rect x="0" y="0" width={GRID_SIZE} height={GRID_SIZE} fill="#FFFFFF" />
	{#each matrix as cell (`${cell.r}-${cell.c}`)}
		<rect
			x={cell.c}
			y={cell.r}
			width="1"
			height="1"
			fill={suspended ? '#991B1B' : '#121619'}
		/>
	{/each}
</svg>

<style>
	.qr-svg {
		display: block;
		shape-rendering: crispEdges;
		border: 1px solid var(--border-subtle);
		padding: 6px;
		background: #ffffff;
		border-radius: var(--radius-sm);
		transition: opacity 0.2s ease, filter 0.2s ease;
	}

	.qr-svg.is-suspended {
		opacity: 0.45;
		filter: grayscale(0.35);
	}
</style>
