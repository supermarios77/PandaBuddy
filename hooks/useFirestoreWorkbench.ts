import { useCallback } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { WorkbenchData, CanvasElement } from '@/types/workbench';

const useFirestoreWorkbench = () => {
  const { user } = useUser();

  const saveWorkbench = useCallback(async (workbenchData: WorkbenchData) => {
    if (!user) return;

    try {
      const workbenchDoc = doc(db, 'workbenches', user.id);
      await setDoc(workbenchDoc, workbenchData);
      console.log('Workbench saved successfully');
    } catch (error) {
      console.error('Error saving workbench:', error);
    }
  }, [user]);

  const loadWorkbench = useCallback(async () => {
    if (!user) return null;

    try {
      const workbenchDoc = doc(db, 'workbenches', user.id);
      const docSnap = await getDoc(workbenchDoc);

      if (docSnap.exists()) {
        const data = docSnap.data() as WorkbenchData;
        const elementsWithImages = await Promise.all(
          data.canvasElements.map(async (element): Promise<CanvasElement> => {
            if (element.type === 'image' && element.imageUrl) {
              const img = new Image();
              img.src = element.imageUrl;
              await new Promise((resolve) => { img.onload = resolve; });
              return { ...element, image: img };
            }
            return element as CanvasElement;
          })
        );
        return { ...data, canvasElements: elementsWithImages };
      } else {
        console.log('No workbench found for this user');
        return null;
      }
    } catch (error) {
      console.error('Error loading workbench:', error);
      return null;
    }
  }, [user]);

  return { saveWorkbench, loadWorkbench };
};

export default useFirestoreWorkbench;