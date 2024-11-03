import { atom, useRecoilState } from "recoil";
import { useUser } from "./useUser";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useFileManager } from "./useFileManager";

export const accessControlAtom = atom({
    key: "accessControl",
    default: {
        limitations: [],
    }
});

export default function useAccessControl() {
    const [projectIndexData, setProjectIndexData] = useState(null);
    const [accessControl, setAccessControl] = useRecoilState(accessControlAtom);
    const user = useUser();
    const fileManager = useFileManager();

    // Memoize the limitations calculation
    const calculateLimitations = useCallback((plan, isLocked) => {
        if (isLocked) {
            if (plan === 'pro') return [];
            if (plan === 'free') return ['play', 'study', 'experiment'];
            return ['play', 'study', 'explore', 'experiment'];
        } else {
            if (plan === 'pro') return [];
            if (plan === 'free') return ['experiment'];
            return ['play', 'params', 'edit', 'experiment'];
        }
    }, []);

    // Update access control only when necessary
    useEffect(() => {
        if (!projectIndexData || !user) return;

        const plan = user.getPlan();
        const newLimitations = calculateLimitations(plan, projectIndexData.locked);
        
        // Only update if limitations have changed
        if (JSON.stringify(accessControl.limitations) !== JSON.stringify(newLimitations)) {
            setAccessControl({ limitations: newLimitations });
        }
    }, [projectIndexData, user, calculateLimitations, setAccessControl, accessControl.limitations]);

    // Memoize the init function
    const init = useCallback(async (name) => {
        try {
            const data = await fileManager.getFile('', 'projectIndex.json');
            const projectData = data.projects.find(project => project.directory === name);
            if (projectData && (!projectIndexData || projectIndexData.directory !== name)) {
                setProjectIndexData(projectData);
            }
        } catch (error) {
            console.error('Error initializing access control:', error);
        }
    }, [fileManager, projectIndexData]);

    return init;
}