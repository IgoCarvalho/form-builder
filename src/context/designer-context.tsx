"use client";

import { FormElementInstance } from "@/components/form-elements";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type DesignerCOntextType = {
  elements: FormElementInstance[];
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: string) => void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;

  updateElement: (id: string, element: FormElementInstance) => void;
};

export const DesignerContext = createContext<DesignerCOntextType | null>(null);

export const useDesigner = () => {
  const context = useContext(DesignerContext);

  if (!context) {
    throw new Error("useDesigner must be used within a DesignerContext");
  }

  return context;
};

export function DesignerContextProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  function addElement(index: number, element: FormElementInstance) {
    setElements((prev) => {
      const newList = [...prev];

      newList.splice(index, 0, element);
      return newList;
    });
  }

  function removeElement(id: string) {
    setElements((prev) => prev.filter((element) => element.id !== id));
  }

  function updateElement(id: string, element: FormElementInstance) {
    setElements((prev) => {
      const newList = [...prev];
      const elementIndex = newList.findIndex((element) => element.id === id);
      newList[elementIndex] = element;
      return newList;
    });
  }

  return (
    <DesignerContext.Provider
      value={{
        elements,
        setElements,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement,
        updateElement,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
