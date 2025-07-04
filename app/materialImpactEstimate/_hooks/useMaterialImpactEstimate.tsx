"use client";
import { useEffect, useState } from "react";
import { MaterialImpactEstimate } from "@/types/product";
import GetMaterialImpacts, {
  CreateMaterialImpact,
  UpdateMaterialImpact,
  DeleteMaterialImpact,
} from "@/services/materialImpacts";

export default function useMaterialImpactEstimate() {
  const [materialImpacts, setMaterialImpacts] = useState<
    MaterialImpactEstimate[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterialImpacts();
  }, []);

  const fetchMaterialImpacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetMaterialImpacts();
      if (data) {
        setMaterialImpacts(data);
      }
    } catch (err) {
      setError("Error fetching material impacts");
      console.error("Error fetching material impacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const createMaterialImpact = async (impactData: {
    materialType: string;
    estimatedCo2SavingsKG: number;
    estimatedWaterSavingsLT: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const impact: MaterialImpactEstimate = {
        id: 0,
        materialType: impactData.materialType,
        estimatedCo2SavingsKG: impactData.estimatedCo2SavingsKG,
        estimatedWaterSavingsLT: impactData.estimatedWaterSavingsLT,
      };

      const newImpact = await CreateMaterialImpact(impact);
      if (newImpact) {
        setMaterialImpacts((prev) => [...prev, newImpact]);
        return newImpact;
      }
    } catch (err) {
      setError("Error creating material impact");
      console.error("Error creating material impact:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMaterialImpact = async (
    id: number,
    impactData: Partial<MaterialImpactEstimate>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedImpact = await UpdateMaterialImpact(
        id,
        impactData as MaterialImpactEstimate
      );
      if (updatedImpact) {
        setMaterialImpacts((prev) =>
          prev.map((impact) => (impact.id === id ? updatedImpact : impact))
        );
        return updatedImpact;
      }
    } catch (err) {
      setError("Error updating material impact");
      console.error("Error updating material impact:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterialImpact = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteMaterialImpact(id);
      if (success) {
        setMaterialImpacts((prev) => prev.filter((impact) => impact.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting material impact");
      console.error("Error deleting material impact:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    materialImpacts,
    loading,
    error,
    fetchMaterialImpacts,
    createMaterialImpact,
    updateMaterialImpact,
    deleteMaterialImpact,
  };
}
