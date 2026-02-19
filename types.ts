
export interface Transaction {
  id: number;
  tanggal: string; // YYYY-MM-DD format
  deskripsi: string;
  pemasukan: number;
  pengeluaran: number;
}
