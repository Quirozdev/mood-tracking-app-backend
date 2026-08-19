import { DataSource } from 'typeorm';

export async function cleanDatabase(dataSource: DataSource) {
  const tables = dataSource.entityMetadatas
    .map(({ tableName }) => {
      return `"${tableName}"`;
    })
    .join(', ');

  if (!tables) return;

  await dataSource.query(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE`);
}
