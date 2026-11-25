/**
 * Genera un hash SHA-256 real en formato hexadecimal usando Web Crypto API,
 * con respaldo determinístico síncrono en caso de entornos sin crypto.subtle.
 */
export async function generateSha256(input: string): Promise<string> {
	if (typeof window !== 'undefined' && window.crypto?.subtle) {
		const encoded = new TextEncoder().encode(input);
		const digest = await window.crypto.subtle.digest('SHA-256', encoded);
		return Array.from(new Uint8Array(digest))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}
	return fallbackHexHash(input);
}

export function fallbackHexHash(input: string): string {
	let h1 = 0x811c9dc5;
	let h2 = 0x01000193;
	const parts: string[] = [];
	for (let round = 0; round < 8; round++) {
		let acc = h1 ^ (round * 0x9e3779b9);
		for (let i = 0; i < input.length; i++) {
			acc ^= input.charCodeAt(i);
			acc = Math.imul(acc, h2);
		}
		parts.push((acc >>> 0).toString(16).padStart(8, '0'));
	}
	return parts.join('');
}

/**
 * Enmascara nombre completo: "María González Soto" -> "María G."
 */
export function maskFullName(fullName: string): string {
	const tokens = fullName.trim().split(/\s+/).filter(Boolean);
	if (tokens.length <= 1) return fullName;
	return `${tokens[0]} ${tokens[1].charAt(0).toUpperCase()}.`;
}

/**
 * Enmascara RUT chileno: "16.482.910-4" -> "••.•••.910-4"
 */
export function maskRut(rut: string): string {
	const cleaned = rut.trim();
	const parts = cleaned.split('-');
	if (parts.length !== 2) return '••.•••.•••-•';
	const body = parts[0];
	const tail = body.slice(-3);
	return `••.•••.${tail}-${parts[1]}`;
}

export function formatDateTimeCL(isoString: string): string {
	const date = new Date(isoString);
	if (Number.isNaN(date.getTime())) return isoString;
	return new Intl.DateTimeFormat('es-CL', {
		dateStyle: 'medium',
		timeStyle: 'medium',
		hour12: false
	}).format(date);
}

export function formatCountdown(remainingMs: number): string {
	const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}
