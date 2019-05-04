import express from 'express'
import { Store } from 'express-session'

export interface MySQLSessionStoreOptions {

	/** Host name for database connection: */
	host: string;

	/** Port number for database connection: */
	port: number;

	/** Database user: */
	user: string;

	/** Password for the above database user: */
	password: string;

	/** Database name: */
	database: string;



	/** Whether or not to automatically check for and clear expired sessions: */
	clearExpired?: boolean;

	/** How frequently expired sessions will be cleared; milliseconds: */
	checkExpirationInterval?: number;

	/** The maximum age of a valid session; milliseconds: */
	expiration?: number;

	/** Whether or not to create the sessions database table, if one does not already exist: */
	createDatabaseTable?: boolean;

	/** Number of connections when creating a connection pool: */
	connectionLimit?: number;

	/** Whether or not to end the database connection when the store is closed.
	The default value of this option depends on whether or not a connection was passed to the constructor.
	If a connection object is passed to the constructor, the default value for this option is false. */
	endConnectionOnClose?: boolean;

	charset?: string;

	schema?: {
		tableName: string;
		columnNames: {
			session_id: string;
			expires: string;
			data: string;
		}
	}
}

export interface Connection {
	//XXX fill in with mysql typings + copy over to internal functions
	query(sql: any, params: any): Promise<[any, any]>; //no callback, returns promise
	query(sql: any, params: any, cb: (err: any | null, rows: any, fields: any) => void): any; //callback, returns non-promise

	end(): Promise<void>;
	end(cb: (err: any | null) => void): void;
}

export class MySQLStore extends Store {
	constructor(options: MySQLSessionStoreOptions, connection?: Connection, callback?: (error?: any) => void);
	constructor(options: Partial<MySQLSessionStoreOptions>, connection: Connection, callback?: (error?: any) => void);

	setOptions(options: MySQLSessionStoreOptions): any;
	validateOptions(options: any): options is MySQLSessionStoreOptions | never;
	createDatabaseTable(cb: (error?: any) => void): any;

	clearExpiredSessions(cb: (error?: any) => void): any;
	setExpirationInterval(interval: number): any;
	clearExpirationInterval(): any;
	
	// Internal functions
	private query(sql: any, params: any, cb: (err: any | null, rows: any, fields: any) => void): any;
	private close(cb: (error?: any) => void): any;

	// Implemented Store methods
	get: (sid: string, callback: (err: any, session?: SessionData | null) => void) => void;
	set: (sid: string, session: SessionData, callback?: (err?: any) => void) => void;
	destroy: (sid: string, callback?: (err?: any) => void) => void;
	all: (callback: (err: any, obj?: { [sid: string]: SessionData; } | null) => void) => void;
	length: (callback: (err: any, length: number) => void) => void;
	clear: (callback?: (err?: any) => void) => void;
	touch: (sid: string, session: SessionData, callback?: (err?: any) => void) => void;
}


export default function MySQLStoreFactory(session: any): typeof MySQLStore;
