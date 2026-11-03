import { Timer } from 'lucide-react';
import type { DatosHidratacion } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';

interface PanelSudoracionProps {
  datos: DatosHidratacion;
  actualizarCampo: <K extends keyof DatosHidratacion>(campo: K, valor: DatosHidratacion[K]) => void;
}

export function PanelSudoracion({ datos, actualizarCampo }: PanelSudoracionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-500">
          <Timer className="w-4 h-4" />
          3. Protocolo de Tasa de Sudoración en Ejercicio (ACSM 2007)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Campo
            id="campo-hidra-pre"
            label="Peso Pre-ejercicio"
            unidad="kg"
            type="number"
            step="0.1"
            value={datos.pesoPre}
            onChange={(e) => actualizarCampo('pesoPre', e.target.value)}
            ayuda="En seco antes de entrenar"
          />
          <Campo
            id="campo-hidra-post"
            label="Peso Post-ejercicio"
            unidad="kg"
            type="number"
            step="0.1"
            value={datos.pesoPost}
            onChange={(e) => actualizarCampo('pesoPost', e.target.value)}
            ayuda="Secado con toalla"
          />
          <Campo
            id="campo-hidra-duracion"
            label="Duración"
            unidad="minutos"
            type="number"
            step="5"
            value={datos.duracionMinutos}
            onChange={(e) => actualizarCampo('duracionMinutos', e.target.value)}
            ayuda="Tiempo efectivo"
          />
          <Campo
            id="campo-hidra-liquido"
            label="Líquido Ingerido"
            unidad="ml"
            type="number"
            step="50"
            value={datos.liquidoIngerido}
            onChange={(e) => actualizarCampo('liquidoIngerido', e.target.value)}
            ayuda="Tomado durante sesión"
          />
          <Campo
            id="campo-hidra-orina"
            label="Volumen Orina"
            unidad="ml"
            type="number"
            step="50"
            value={datos.orina}
            onChange={(e) => actualizarCampo('orina', e.target.value)}
            ayuda="Evacuado durante sesión"
          />
        </div>
      </div>
    </Card>
  );
}
