import React, { useEffect } from 'react';
import { useAppContext } from '../AppContext';

export const GlobalTaskRunner: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const runningTasks = state.tasks.filter(t => t.status === 'running');
    const completedTasks = state.tasks.filter(t => t.status === 'completed' || t.status === 'failed');

    useEffect(() => {
        if (completedTasks.length > 0) {
            const timer = setTimeout(() => {
                dispatch({ type: 'CLEAR_COMPLETED_TASKS' });
            }, 5000); // Clear after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [completedTasks.length, dispatch]);

    if (state.tasks.length === 0) {
        return null;
    }

    return (
        <div className="hidden lg:flex flex-col gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
            <p className="font-bold">Actividad Reciente</p>
            {runningTasks.length > 0 && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{runningTasks[0].name}... ({runningTasks.length} en progreso)</span>
                </div>
            )}
            {completedTasks.map(task => (
                 <div key={task.id} className={`flex items-center gap-2 ${task.status === 'failed' ? 'text-red-500' : 'text-green-600'}`}>
                     <span className="material-symbols-outlined text-base">
                         {task.status === 'failed' ? 'error' : 'check_circle'}
                     </span>
                     <span>{task.name} {task.status === 'failed' ? 'falló' : 'completado'}</span>
                 </div>
            ))}
        </div>
    );
};
