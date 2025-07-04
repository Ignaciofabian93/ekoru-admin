"use client";
import { useEffect, useState } from "react";
import { Region, Country } from "@/types/location";
import GetRegions, {
  CreateRegion,
  UpdateRegion,
  DeleteRegion,
} from "@/services/regions";
import GetCountries from "@/services/countries";

export default function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [regionsData, countriesData] = await Promise.all([
        GetRegions(),
        GetCountries(),
      ]);

      if (regionsData) {
        setRegions(regionsData);
      }
      if (countriesData) {
        setCountries(countriesData);
      }
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createRegion = async (regionData: {
    region: string;
    countryId: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const region: Region = {
        id: 0,
        region: regionData.region,
        countryId: regionData.countryId,
      };

      const newRegion = await CreateRegion(region);
      if (newRegion) {
        setRegions((prev) => [...prev, newRegion]);
        return newRegion;
      }
    } catch (err) {
      setError("Error creating region");
      console.error("Error creating region:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRegion = async (id: number, regionData: Partial<Region>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRegion = await UpdateRegion(id, regionData as Region);
      if (updatedRegion) {
        setRegions((prev) =>
          prev.map((region) => (region.id === id ? updatedRegion : region))
        );
        return updatedRegion;
      }
    } catch (err) {
      setError("Error updating region");
      console.error("Error updating region:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRegion = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteRegion(id);
      if (success) {
        setRegions((prev) => prev.filter((region) => region.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting region");
      console.error("Error deleting region:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    regions,
    countries,
    loading,
    error,
    fetchData,
    createRegion,
    updateRegion,
    deleteRegion,
  };
}
