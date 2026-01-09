import React, { useState, useEffect } from 'react';
import { Database, Client, ClientPoints, Reward } from '../types';
import { getDatabase, saveDatabase, resetDatabase } from '../services/db';
import { Save, RefreshCw, Plus, Trash2, RotateCcw } from 'lucide-react';

export const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [db, setDb] = useState<Database>(getDatabase());
  const [activeTab, setActiveTab] = useState<'clients' | 'points' | 'rewards'>('clients');

  useEffect(() => {
    setDb(getDatabase());
  }, []);

  const handleSave = () => {
    saveDatabase(db);
    alert('Base de datos actualizada correctamente.');
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro? Esto borrará todos los cambios actuales y restaurará los datos originales definidos en el archivo de código (db.ts).')) {
      const freshDb = resetDatabase();
      setDb(freshDb);
      alert('Base de datos restaurada a los valores originales.');
    }
  };

  const updateField = (section: keyof Database, index: number, field: string, value: any) => {
    const newData = { ...db };
    // @ts-ignore
    newData[section][index][field] = value;
    setDb(newData);
  };

  const deleteRow = (section: keyof Database, index: number) => {
    const newData = { ...db };
    // @ts-ignore
    newData[section].splice(index, 1);
    setDb(newData);
  };

  const addRow = (section: keyof Database) => {
    const newData = { ...db };
    if (section === 'clients') {
      newData.clients.push({ id: Date.now().toString(), businessId: '0000', pointOfSale: 'Nuevo POS', password: 'gulf', type: 'Normal' });
    } else if (section === 'points') {
      newData.points.push({ pointOfSale: 'Nuevo POS', points: 0 });
    } else if (section === 'rewards') {
      newData.rewards.push({
        id: Date.now().toString(),
        name: 'Nuevo Premio',
        description: 'Descripción',
        pointsPareto: 0,
        pointsNormal: 0,
        imageUrl: 'https://picsum.photos/200'
      });
    }
    setDb(newData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-gulf-blue">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-sports text-gulf-blue">Panel de Administración</h2>
        <div className="flex items-center space-x-4">
            <button onClick={handleReset} className="text-sm text-gray-500 hover:text-red-600 flex items-center transition-colors">
              <RotateCcw size={16} className="mr-1" /> Restaurar Datos Originales
            </button>
            <span className="text-gray-300">|</span>
            <button onClick={onLogout} className="text-sm text-red-500 hover:underline">Salir del Admin</button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6 border-b pb-2">
        {(['clients', 'points', 'rewards'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold uppercase ${activeTab === tab ? 'bg-gulf-orange text-white rounded' : 'text-gray-500'}`}
          >
            {tab === 'clients' ? 'Clientes (CSV 1)' : tab === 'points' ? 'Puntos (CSV 2)' : 'Premios (CSV 3)'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-gray-50 p-4 rounded border">
        <table className="min-w-full text-sm">
          <thead>
            {activeTab === 'clients' && (
              <tr>
                <th className="p-2 text-left">ID (Usuario)</th>
                <th className="p-2 text-left">POS</th>
                <th className="p-2 text-left">Password</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2">Acción</th>
              </tr>
            )}
            {activeTab === 'points' && (
              <tr>
                <th className="p-2 text-left">POS</th>
                <th className="p-2 text-left">Puntos Disponibles</th>
                <th className="p-2">Acción</th>
              </tr>
            )}
            {activeTab === 'rewards' && (
              <tr>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Puntos Pareto</th>
                <th className="p-2 text-left">Puntos Normal</th>
                <th className="p-2">Acción</th>
              </tr>
            )}
          </thead>
          <tbody>
            {activeTab === 'clients' && db.clients.map((client, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2"><input value={client.businessId} onChange={(e) => updateField('clients', idx, 'businessId', e.target.value)} className="w-full border p-1 rounded" /></td>
                <td className="p-2"><input value={client.pointOfSale} onChange={(e) => updateField('clients', idx, 'pointOfSale', e.target.value)} className="w-full border p-1 rounded" /></td>
                <td className="p-2"><input value={client.password} onChange={(e) => updateField('clients', idx, 'password', e.target.value)} className="w-full border p-1 rounded" /></td>
                <td className="p-2">
                  <select value={client.type} onChange={(e) => updateField('clients', idx, 'type', e.target.value)} className="w-full border p-1 rounded">
                    <option value="Pareto">Pareto</option>
                    <option value="Normal">Normal</option>
                  </select>
                </td>
                <td className="p-2 text-center"><button onClick={() => deleteRow('clients', idx)} className="text-red-500"><Trash2 size={16}/></button></td>
              </tr>
            ))}
            {activeTab === 'points' && db.points.map((p, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2"><input value={p.pointOfSale} onChange={(e) => updateField('points', idx, 'pointOfSale', e.target.value)} className="w-full border p-1 rounded" /></td>
                <td className="p-2"><input type="number" value={p.points} onChange={(e) => updateField('points', idx, 'points', parseInt(e.target.value))} className="w-full border p-1 rounded" /></td>
                <td className="p-2 text-center"><button onClick={() => deleteRow('points', idx)} className="text-red-500"><Trash2 size={16}/></button></td>
              </tr>
            ))}
            {activeTab === 'rewards' && db.rewards.map((r, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2"><input value={r.name} onChange={(e) => updateField('rewards', idx, 'name', e.target.value)} className="w-full border p-1 rounded" /></td>
                <td className="p-2"><input type="number" value={r.pointsPareto} onChange={(e) => updateField('rewards', idx, 'pointsPareto', parseInt(e.target.value))} className="w-full border p-1 rounded" /></td>
                <td className="p-2"><input type="number" value={r.pointsNormal} onChange={(e) => updateField('rewards', idx, 'pointsNormal', parseInt(e.target.value))} className="w-full border p-1 rounded" /></td>
                <td className="p-2 text-center"><button onClick={() => deleteRow('rewards', idx)} className="text-red-500"><Trash2 size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={() => addRow(activeTab)} className="flex items-center text-gulf-blue hover:text-gulf-orange">
          <Plus size={18} className="mr-1" /> Agregar Fila
        </button>
        <button onClick={handleSave} className="flex items-center bg-gulf-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-gulf-orange transition-colors">
          <Save size={18} className="mr-2" /> Guardar Cambios
        </button>
      </div>
    </div>
  );
};