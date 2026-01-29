/**
 * Hook placeholder para gestión de documentos en Guantera.
 *
 * Fase 8 (maquetado): solo define la forma de la API y devuelve
 * valores mock sin llamar a ningún backend.
 */

export interface GuanteraDocument {
  readonly id: string;
  readonly name: string;
  readonly sizeLabel: string;
  readonly updatedAt?: string;
  readonly url?: string;
}

export interface UseGuanteraDocumentsResult {
  documents: GuanteraDocument[];
  loading: boolean;
  error: Error | null;
  upload: (file: File) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGuanteraDocuments(
  _plate: string | undefined,
  _optionKey: string | undefined,
): UseGuanteraDocumentsResult {
  // Fase 8 maquetado: devolver lista vacía y operaciones no-op.
  return {
    documents: [],
    loading: false,
    error: null,
    async upload() {
      // no-op (quemado)
    },
    async remove() {
      // no-op (quemado)
    },
    async refetch() {
      // no-op (quemado)
    },
  };
}

