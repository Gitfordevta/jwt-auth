declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECERET_KEY: string;
    JWT_REFERESH_KEY: string;
  }
}
