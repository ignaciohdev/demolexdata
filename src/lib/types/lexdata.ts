export type SessionRole = 'dpo' | 'comercial';
export type SubscriptionStatus = 'active' | 'suspended';
export type BreachType =
	| 'Extravío de dispositivo'
	| 'Envío erróneo de destinatarios'
	| 'Acceso no autorizado';

export interface RatEntry {
	id: string;
	databaseName: string;
	purpose: string;
	lawfulBasis: string;
	retentionPeriod: string;
	securityControl: string;
	riskLevel: 'Bajo' | 'Medio';
}

export interface ArsopbRequest {
	id: string;
	code: string;
	rightType: 'Bloqueo Temporal' | 'Acceso' | 'Supresión' | 'Rectificación';
	requesterName: string;
	requesterRut: string;
	receivedAt: string;
	legalDeadlineDays: number;
	daysRemaining: number;
	status: 'En Revisión DPO' | 'En Plazo Legal';
}

export interface TechnicalCheck {
	id: string;
	name: string;
	category: string;
	executedAt: string;
	result: 'Sin Hallazgos';
}

export interface ProspectRecord {
	id: string;
	fullName: string;
	rut: string;
	phone: string;
	email: string;
	consentQuote: boolean;
	consentMarketing: boolean;
	consentFinancial: boolean;
	timestampIso: string;
	ipAddress: string;
	sha256Hash: string;
}

export interface CallAuditLog {
	id: string;
	prospectId: string;
	prospectLabel: string;
	channel: string;
	operatorRole: string;
	timestampIso: string;
	auditHash: string;
}

export interface WorkerHygieneRecord {
	id: string;
	workerLabel: string;
	department: string;
	capsuleStatus: 'Aprobada (100%)' | 'Aprobada (90%)' | 'Pendiente';
	fridayChecklistDone: boolean;
	confirmedAt: string | null;
	legalStatus: 'Empresa Eximida - Cumplimiento Acreditado' | 'Pendiente';
}

export interface BreachReport {
	id: string;
	code: string;
	type: BreachType;
	description: string;
	reportedAtIso: string;
	deadlineAtMs: number;
	notifiedDpoAtIso: string;
	notifiedTiAtIso: string;
	receiptHash: string;
	status: 'Alerta 72h Activa' | 'Contenida';
}

export interface LexDataState {
	sessionRole: SessionRole;
	subscriptionStatus: SubscriptionStatus;
	organization: {
		name: string;
		rut: string;
		totalWorkers: number;
		commercialExecutives: number;
		systems: string[];
	};
	governance: {
		legalImplementation: string;
		externalDpo: string;
		techOperation: string;
	};
	ratMatrix: RatEntry[];
	arsopbRequests: ArsopbRequest[];
	technicalChecks: TechnicalCheck[];
	prospects: ProspectRecord[];
	callLogs: CallAuditLog[];
	baseCompliantWorkers: number;
	workers: WorkerHygieneRecord[];
	breaches: BreachReport[];
}
