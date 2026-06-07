export interface IDBStoreInfo {
  name: string
  keyPath: string | string[] | null
  autoIncrement: boolean
  recordCount: number
}

export interface IDBDatabaseInfo {
  name: string
  version: number
  stores: IDBStoreInfo[]
}
