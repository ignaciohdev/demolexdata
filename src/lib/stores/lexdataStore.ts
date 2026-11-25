import { derived, writable } from 'svelte/store';
import type {
	ArsopbRequest,
	BreachReport,
	BreachType,
	CallAuditLog,
	LexDataState,
	ProspectRecord,
	SessionRole,
	SubscriptionStatus,
	SuppressionRecord
} from '#lib/types/lexdata.ts';
import { fallbackHexHash, generateSha256, maskFullName, maskRut } from '#lib/utils/formatters.ts';

export const BRAND_NAME = 'LexData';

const STORAGE_KEY = 'lexdata_ley21719_demo_v1';

function createInitialState(): LexDataState {
	return {
		sessionRole: 'dpo',
		subscriptionStatus: 'active',
		organization: {
			name: 'Constructora e Inmobiliaria Andes Sur SpA',
			rut: '76.543.210-8',
			totalWorkers: 50,
			commercialExecutives: 15,
			systems: ['Libro de Obras Electrónico', 'CRM de Ventas Inmobiliarias']
		},
		governance: {
			legalImplementation: 'Estudio Jurídico (Levantamiento documental y matriz RAT)',
			externalDpo: 'Delegado Externo Asignado (Separado de la implementación)',
			techOperation: `Plataforma ${BRAND_NAME}`
		},
		ratMatrix: [
			{
				id: 'rat-01',
				databaseName: 'Libro de Obras Electrónico',
				purpose:
					'Registro obligatorio de faenas, asistencia en obra, subcontratistas y trazabilidad constructiva.',
				lawfulBasis: 'Obligación Legal (LGUC / Responsabilidad Civil)',
				retentionPeriod: '5 a 10 años por responsabilidad civil de construcción',
				securityControl: 'Cifrado Activo + Bitácora Inmutable',
				riskLevel: 'Bajo'
			},
			{
				id: 'rat-02',
				databaseName: 'Base de Leads Comerciales',
				purpose:
					'Cotización de proyectos inmobiliarios, seguimiento comercial y evaluación crediticia opcional.',
				lawfulBasis: 'Consentimiento granular revocable',
				retentionPeriod: '24 meses sin interacción o revocación inmediata',
				securityControl: 'Prueba de Consentimiento SHA-256 + Enmascaramiento CRM',
				riskLevel: 'Bajo'
			},
			{
				id: 'rat-03',
				databaseName: 'Expedientes RR.HH. y Contratos',
				purpose:
					'Gestión contractual, remuneraciones, anexos de confidencialidad y capacitación interna.',
				lawfulBasis: 'Ejecución de Contrato y Obligación Legal',
				retentionPeriod: '2 años post-término según Código del Trabajo',
				securityControl: 'Control de Acceso por Rol + Verificación de Respaldos',
				riskLevel: 'Bajo'
			}
		],
		arsopbRequests: [
			{
				id: 'arsopb-01',
				code: 'SOL-21719-041',
				rightType: 'Bloqueo Temporal',
				requesterName: 'Patricia Morales Vera',
				requesterRut: '15.842.418-2',
				receivedAt: '2026-11-24T15:10:00-03:00',
				legalDeadlineDays: 2,
				daysRemaining: 1,
				status: 'En Revisión DPO'
			},
			{
				id: 'arsopb-02',
				code: 'SOL-21719-042',
				rightType: 'Acceso',
				requesterName: 'Andrés Sepúlveda Muñoz',
				requesterRut: '13.409.893-K',
				receivedAt: '2026-11-18T10:25:00-03:00',
				legalDeadlineDays: 30,
				daysRemaining: 23,
				status: 'En Plazo Legal'
			}
		],
		technicalChecks: [
			{
				id: 'chk-01',
				name: 'Verificación de Respaldos Cifrados',
				category: 'Continuidad Operativa',
				executedAt: '2026-11-22T03:00:00-03:00',
				result: 'Sin Hallazgos'
			},
			{
				id: 'chk-02',
				name: 'Cifrado Activo en Reposo y Tránsito (TLS 1.3 / AES-256)',
				category: 'Seguridad Perimetral',
				executedAt: '2026-11-19T03:00:00-03:00',
				result: 'Sin Hallazgos'
			},
			{
				id: 'chk-03',
				name: 'Auditoría de Privilegios y Enmascaramiento CRM',
				category: 'Control de Accesos',
				executedAt: '2026-11-12T03:00:00-03:00',
				result: 'Sin Hallazgos'
			},
			{
				id: 'chk-04',
				name: 'Integridad de Registros de Consentimiento',
				category: 'Trazabilidad Probatoria',
				executedAt: '2026-11-05T03:00:00-03:00',
				result: 'Sin Hallazgos'
			}
		],
		prospects: [
			{
				id: 'pros-01',
				fullName: 'María González Soto',
				rut: '16.482.910-4',
				phone: '+56 9 8412 3390',
				email: 'm.gonzalez@ejemplo-cliente.cl',
				consentQuote: true,
				consentMarketing: true,
				consentFinancial: false,
				timestampIso: '2026-11-23T16:42:11-03:00',
				ipAddress: '190.162.44.18',
				sha256Hash: '8e41c7d904a52b1f7f10829c3a44b9128d7710a6f4e812c95d2b3a1c0e8f4d21'
			},
			{
				id: 'pros-02',
				fullName: 'Carlos Mendoza Riquelme',
				rut: '14.920.341-7',
				phone: '+56 9 7105 8842',
				email: 'c.mendoza@ejemplo-cliente.cl',
				consentQuote: true,
				consentMarketing: false,
				consentFinancial: true,
				timestampIso: '2026-11-22T11:18:05-03:00',
				ipAddress: '186.103.82.91',
				sha256Hash: '3b90f2a14c78d6e1054a928f1b73e4c920a18f6d3c5b2a907e4d1c8b3f6a5092'
			},
			{
				id: 'pros-03',
				fullName: 'Valentina Pérez Lagos',
				rut: '18.215.672-1',
				phone: '+56 9 9321 4407',
				email: 'v.perez@ejemplo-cliente.cl',
				consentQuote: true,
				consentMarketing: true,
				consentFinancial: true,
				timestampIso: '2026-11-21T09:50:44-03:00',
				ipAddress: '200.83.19.120',
				sha256Hash: 'c1a9d4e70b82f5c319e60a4b2d87f3c51a9e04b7d2c6f8a13e5b9d0c7a4f2816'
			}
		],
		callLogs: [
			{
				id: 'call-01',
				prospectId: 'pros-01',
				prospectLabel: 'María G.',
				channel: 'Central Encriptada VoIP',
				operatorRole: 'Ejecutivo Comercial (Sesión Restringida)',
				timestampIso: '2026-11-24T11:05:22-03:00',
				auditHash: '4f12a8c901d3b7e2'
			}
		],
		baseCompliantWorkers: 40,
		workers: [
			{
				id: 'wrk-01',
				workerLabel: 'Administrador de Obra — Faena Sur',
				department: 'Operaciones y Libro de Obras',
				capsuleStatus: 'Aprobada (100%)',
				fridayChecklistDone: true,
				confirmedAt: '2026-11-20T18:04:12-03:00',
				legalStatus: 'Empresa Eximida - Cumplimiento Acreditado'
			},
			{
				id: 'wrk-02',
				workerLabel: 'Jefatura de Sala de Ventas — Puesto 01',
				department: 'Gerencia Comercial',
				capsuleStatus: 'Aprobada (100%)',
				fridayChecklistDone: true,
				confirmedAt: '2026-11-20T18:11:45-03:00',
				legalStatus: 'Empresa Eximida - Cumplimiento Acreditado'
			},
			{
				id: 'wrk-03',
				workerLabel: 'Analista de Remuneraciones — Puesto 02',
				department: 'Recursos Humanos',
				capsuleStatus: 'Aprobada (100%)',
				fridayChecklistDone: true,
				confirmedAt: '2026-11-20T17:52:09-03:00',
				legalStatus: 'Empresa Eximida - Cumplimiento Acreditado'
			},
			{
				id: 'wrk-04',
				workerLabel: 'Ejecutivo Comercial — Puesto 04',
				department: 'Gerencia Comercial',
				capsuleStatus: 'Aprobada (90%)',
				fridayChecklistDone: true,
				confirmedAt: '2026-11-20T18:19:33-03:00',
				legalStatus: 'Empresa Eximida - Cumplimiento Acreditado'
			},
			{
				id: 'wrk-05',
				workerLabel: 'Coordinador de Adquisiciones — Puesto 07',
				department: 'Abastecimiento',
				capsuleStatus: 'Aprobada (100%)',
				fridayChecklistDone: true,
				confirmedAt: '2026-11-20T17:48:55-03:00',
				legalStatus: 'Empresa Eximida - Cumplimiento Acreditado'
			},
			{
				id: 'wrk-06',
				workerLabel: 'Encargado de Control Documental — Faena Norte',
				department: 'Operaciones y Libro de Obras',
				capsuleStatus: 'Aprobada (100%)',
				fridayChecklistDone: true,
				confirmedAt: '2026-11-20T18:02:19-03:00',
				legalStatus: 'Empresa Eximida - Cumplimiento Acreditado'
			},
			{
				id: 'wrk-07',
				workerLabel: 'Soporte Operativo — Puesto 09',
				department: 'Encargado Interno TI',
				capsuleStatus: 'Aprobada (100%)',
				fridayChecklistDone: true,
				confirmedAt: '2026-11-20T18:25:01-03:00',
				legalStatus: 'Empresa Eximida - Cumplimiento Acreditado'
			},
			{
				id: 'wrk-08',
				workerLabel: 'Ejecutivo Comercial — Puesto 11',
				department: 'Gerencia Comercial',
				capsuleStatus: 'Aprobada (90%)',
				fridayChecklistDone: false,
				confirmedAt: null,
				legalStatus: 'Pendiente'
			},
			{
				id: 'wrk-09',
				workerLabel: 'Asistente de Postventa — Puesto 12',
				department: 'Atención a Propietarios',
				capsuleStatus: 'Aprobada (100%)',
				fridayChecklistDone: false,
				confirmedAt: null,
				legalStatus: 'Pendiente'
			},
			{
				id: 'wrk-10',
				workerLabel: 'Supervisor de Terreno — Faena Poniente',
				department: 'Operaciones y Libro de Obras',
				capsuleStatus: 'Pendiente',
				fridayChecklistDone: false,
				confirmedAt: null,
				legalStatus: 'Pendiente'
			}
		],
		breaches: [],
		suppressions: [
			{
				id: 'sup-00',
				code: 'CERT-SUP-21719-019',
				titularMasked: 'Lucía F. (••.•••.304-9)',
				databaseScope: 'Base de Leads Comerciales (CRM)',
				reason: 'Revocación de consentimiento comercial solicitada por el titular',
				legalBasisResolution:
					'Supresión total en CRM ejecutada. Libro de Obras y RR.HH. sin registros del titular.',
				executedByRole: 'DPO Externo Independiente',
				executedAtIso: '2026-11-19T14:22:08-03:00',
				erasureSha256: '7c2e9a41b80f3d5612e49a80c17f5e2390b1d4a8c6e72f1093a4d8b5e1c0f732'
			}
		]
	};
}

function loadInitialState(): LexDataState {
	const fallback = createInitialState();
	if (typeof window === 'undefined') return fallback;

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw) as Partial<LexDataState>;
		const validArsopb =
			Array.isArray(parsed.arsopbRequests) &&
			parsed.arsopbRequests.every((r) => typeof r.requesterName === 'string' && typeof r.requesterRut === 'string')
				? parsed.arsopbRequests
				: fallback.arsopbRequests;
		const validSuppressions = Array.isArray(parsed.suppressions)
			? parsed.suppressions
			: fallback.suppressions;
		return {
			...fallback,
			...parsed,
			arsopbRequests: validArsopb,
			suppressions: validSuppressions,
			organization: { ...fallback.organization, ...(parsed.organization ?? {}) },
			governance: { ...fallback.governance, ...(parsed.governance ?? {}) }
		};
	} catch {
		return fallback;
	}
}

function persistState(state: LexDataState): void {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Ignorar errores de cuota de almacenamiento en modo demostración
	}
}

function createLexDataStore() {
	const { subscribe, set, update } = writable<LexDataState>(loadInitialState());

	function commit(updater: (current: LexDataState) => LexDataState) {
		update((current) => {
			const next = updater(current);
			persistState(next);
			return next;
		});
	}

	return {
		subscribe,
		setSessionRole(sessionRole: SessionRole) {
			commit((state) => ({ ...state, sessionRole }));
		},
		setSubscriptionStatus(subscriptionStatus: SubscriptionStatus) {
			commit((state) => ({ ...state, subscriptionStatus }));
		},
		async addProspect(input: {
			fullName: string;
			rut: string;
			phone: string;
			email: string;
			consentQuote: boolean;
			consentMarketing: boolean;
			consentFinancial: boolean;
		}): Promise<ProspectRecord> {
			const timestampIso = new Date().toISOString();
			const ipAddress = '190.162.44.18';
			const payload = JSON.stringify({
				...input,
				timestampIso,
				ipAddress,
				org: '76.543.210-8'
			});
			const sha256Hash = await generateSha256(payload);
			const record: ProspectRecord = {
				id: `pros-${Date.now()}`,
				...input,
				timestampIso,
				ipAddress,
				sha256Hash
			};

			commit((state) => ({
				...state,
				prospects: [record, ...state.prospects]
			}));

			return record;
		},
		async registerEncryptedCall(prospect: ProspectRecord): Promise<CallAuditLog> {
			const timestampIso = new Date().toISOString();
			const rawHash = await generateSha256(`${prospect.id}:${timestampIso}:voip`);
			const entry: CallAuditLog = {
				id: `call-${Date.now()}`,
				prospectId: prospect.id,
				prospectLabel: maskFullName(prospect.fullName),
				channel: 'Central Encriptada VoIP',
				operatorRole: 'Ejecutivo Comercial (Sesión Restringida)',
				timestampIso,
				auditHash: rawHash.slice(0, 16)
			};

			commit((state) => ({
				...state,
				callLogs: [entry, ...state.callLogs].slice(0, 8)
			}));

			return entry;
		},
		confirmWorkerClosure(workerId: string) {
			const confirmedAt = new Date().toISOString();
			commit((state) => ({
				...state,
				workers: state.workers.map((worker) =>
					worker.id === workerId
						? {
								...worker,
								capsuleStatus:
									worker.capsuleStatus === 'Pendiente' ? 'Aprobada (100%)' : worker.capsuleStatus,
								fridayChecklistDone: true,
								confirmedAt,
								legalStatus: 'Empresa Eximida - Cumplimiento Acreditado'
							}
						: worker
				)
			}));
		},
		async reportBreach(type: BreachType, description: string): Promise<BreachReport> {
			const nowMs = Date.now();
			const reportedAtIso = new Date(nowMs).toISOString();
			const deadlineAtMs = nowMs + 72 * 60 * 60 * 1000;
			const receiptHash = (
				await generateSha256(`${type}:${description}:${reportedAtIso}:76.543.210-8`)
			).slice(0, 20);

			const report: BreachReport = {
				id: `breach-${nowMs}`,
				code: `INC-72H-${String(nowMs).slice(-4)}`,
				type,
				description: description.trim(),
				reportedAtIso,
				deadlineAtMs,
				notifiedDpoAtIso: new Date(nowMs + 400).toISOString(),
				notifiedTiAtIso: new Date(nowMs + 700).toISOString(),
				receiptHash,
				status: 'Alerta 72h Activa'
			};

			commit((state) => ({
				...state,
				breaches: [report, ...state.breaches]
			}));

			return report;
		},
		resolveBreach(breachId: string) {
			commit((state) => ({
				...state,
				breaches: state.breaches.map((b) =>
					b.id === breachId ? { ...b, status: 'Contenida' } : b
				)
			}));
		},
		requestProspectSuppression(prospect: ProspectRecord): ArsopbRequest {
			const nowIso = new Date().toISOString();
			const req: ArsopbRequest = {
				id: `arsopb-${Date.now()}`,
				code: `SOL-21719-${String(Date.now()).slice(-3)}`,
				rightType: 'Supresión',
				requesterName: prospect.fullName,
				requesterRut: prospect.rut,
				receivedAt: nowIso,
				legalDeadlineDays: 30,
				daysRemaining: 30,
				status: 'En Revisión DPO',
				prospectId: prospect.id
			};

			commit((state) => ({
				...state,
				arsopbRequests: [req, ...state.arsopbRequests.filter((r) => r.prospectId !== prospect.id)]
			}));

			return req;
		},
		async executeProspectSuppression(
			prospect: ProspectRecord,
			reason = 'Solicitud expresa de supresión y revocación de consentimiento (Art. 7 Ley 21.719)'
		): Promise<SuppressionRecord> {
			const executedAtIso = new Date().toISOString();
			const titularMasked = `${maskFullName(prospect.fullName)} (${maskRut(prospect.rut)})`;
			const code = `CERT-SUP-21719-${String(Date.now()).slice(-3)}`;
			const erasureSha256 = await generateSha256(
				JSON.stringify({
					code,
					titularMasked,
					executedAtIso,
					orgRut: '76.543.210-8',
					action: 'SUPRESION_CRM_ART_7'
				})
			);

			const record: SuppressionRecord = {
				id: `sup-${Date.now()}`,
				code,
				titularMasked,
				databaseScope: 'Base de Leads Comerciales (CRM)',
				reason,
				legalBasisResolution:
					'Datos identificatorios eliminados del CRM. Bases con obligación legal (Libro de Obras 5–10 años / RR.HH. 2 años) permanecen resguardadas y bloqueadas para uso comercial.',
				executedByRole: 'Gerencia / DPO Externo Independiente',
				executedAtIso,
				erasureSha256
			};

			commit((state) => ({
				...state,
				prospects: state.prospects.filter((p) => p.id !== prospect.id),
				arsopbRequests: state.arsopbRequests.map((r) =>
					r.prospectId === prospect.id ? { ...r, status: 'Supresión Ejecutada' } : r
				),
				suppressions: [record, ...state.suppressions]
			}));

			return record;
		},
		async executeArsopbSuppression(requestId: string): Promise<SuppressionRecord | null> {
			let targetReq: ArsopbRequest | undefined;
			let linkedProspect: ProspectRecord | undefined;

			const unsubscribe = subscribe((s) => {
				targetReq = s.arsopbRequests.find((r) => r.id === requestId);
				if (targetReq?.prospectId) {
					linkedProspect = s.prospects.find((p) => p.id === targetReq?.prospectId);
				}
			});
			unsubscribe();

			if (!targetReq) return null;

			if (linkedProspect) {
				return this.executeProspectSuppression(
					linkedProspect,
					`Resolución solicitud ARSOPB ${targetReq.code} (Art. 7 Ley 21.719)`
				);
			}

			const executedAtIso = new Date().toISOString();
			const titularMasked = `${maskFullName(targetReq.requesterName)} (${maskRut(targetReq.requesterRut)})`;
			const code = `CERT-SUP-21719-${String(Date.now()).slice(-3)}`;
			const erasureSha256 = await generateSha256(
				`${code}:${targetReq.code}:${executedAtIso}:76.543.210-8`
			);

			const record: SuppressionRecord = {
				id: `sup-${Date.now()}`,
				code,
				titularMasked,
				databaseScope: 'Base de Leads Comerciales (CRM)',
				reason: `Resolución solicitud ARSOPB ${targetReq.code}`,
				legalBasisResolution:
					'Supresión ejecutada en base comercial. Bases bajo obligación legal vigente permanecen bloqueadas comercialmente.',
				executedByRole: 'Gerencia / DPO Externo Independiente',
				executedAtIso,
				erasureSha256
			};

			commit((state) => ({
				...state,
				arsopbRequests: state.arsopbRequests.map((r) =>
					r.id === requestId ? { ...r, status: 'Supresión Ejecutada' } : r
				),
				suppressions: [record, ...state.suppressions]
			}));

			return record;
		},
		resetDemoData() {
			const fresh = createInitialState();
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(STORAGE_KEY);
			}
			persistState(fresh);
			set(fresh);
		}
	};
}

export const lexdataStore = createLexDataStore();

export const lexdataMetrics = derived(lexdataStore, ($state) => {
	const tableCompliant = $state.workers.filter(
		(w) => w.legalStatus === 'Empresa Eximida - Cumplimiento Acreditado'
	).length;
	const compliantWorkersCount = Math.min(
		$state.organization.totalWorkers,
		$state.baseCompliantWorkers + tableCompliant
	);
	const pendingWorkersCount = $state.organization.totalWorkers - compliantWorkersCount;
	const activeBreaches = $state.breaches.filter((b) => b.status === 'Alerta 72h Activa');

	const baseScore = 37 + compliantWorkersCount; // 37 + 47 = 84% inicial exacto
	const extraConsentBonus = Math.min(
		3,
		Math.max(0, $state.prospects.length + $state.suppressions.length - 4)
	);
	const breachPenalty = activeBreaches.length > 0 ? 12 : 0;
	const suspensionPenalty = $state.subscriptionStatus === 'suspended' ? 20 : 0;

	const complianceIndex = Math.max(
		0,
		Math.min(100, baseScore + extraConsentBonus - breachPenalty - suspensionPenalty)
	);

	let complianceBadge = 'Blindaje Activo';
	let complianceTone: 'legal' | 'alert' | 'danger' = 'legal';
	if ($state.subscriptionStatus === 'suspended') {
		complianceBadge = 'Monitoreo Suspendido';
		complianceTone = 'danger';
	} else if (activeBreaches.length > 0) {
		complianceBadge = 'Alerta Activa 72h';
		complianceTone = 'danger';
	}

	const fineExposureLabel =
		$state.subscriptionStatus === 'suspended'
			? 'Riesgo Elevado'
			: activeBreaches.length > 0
				? 'Riesgo Moderado'
				: 'Riesgo Bajo';

	const fineExposureMeta =
		$state.subscriptionStatus === 'suspended'
			? 'Certificación y monitoreo técnico detenidos por mora'
			: activeBreaches.length > 0
				? 'Incidente bajo protocolo de notificación obligatoria 72h'
				: 'Bases de datos con licitud acreditada';

	const verificationSealHash = fallbackHexHash(
		`${$state.organization.rut}:${$state.subscriptionStatus}:${complianceIndex}`
	).slice(0, 16);

	return {
		compliantWorkersCount,
		pendingWorkersCount,
		coveragePercent: Math.round((compliantWorkersCount / $state.organization.totalWorkers) * 100),
		activeBreaches,
		complianceIndex,
		complianceBadge,
		complianceTone,
		fineExposureLabel,
		fineExposureMeta,
		activeArsopbCount: $state.arsopbRequests.filter((r) => r.status !== 'Supresión Ejecutada')
			.length,
		technicalChecksCount: $state.technicalChecks.length,
		verificationSealHash
	};
});
