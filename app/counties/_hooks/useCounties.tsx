"use client";
import { useEffect, useState } from "react";
import { County, City } from "@/types/location";
import GetCounties, {
  CreateCounty,
  UpdateCounty,
  DeleteCounty,
} from "@/services/counties";
import GetCities from "@/services/cities";

export default function useCounties() {
  const [counties, setCounties] = useState<County[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [countiesData, citiesData] = await Promise.all([
        GetCounties(),
        GetCities(),
      ]);

      if (countiesData) {
        setCounties(countiesData);
      }
      if (citiesData) {
        setCities(citiesData);
      }
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCounty = async (countyData: {
    county: string;
    cityId: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const county: County = {
        id: 0,
        county: countyData.county,
        cityId: countyData.cityId,
      };

      const newCounty = await CreateCounty(county);
      if (newCounty) {
        setCounties((prev) => [...prev, newCounty]);
        return newCounty;
      }
    } catch (err) {
      setError("Error creating county");
      console.error("Error creating county:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCounty = async (id: number, countyData: Partial<County>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCounty = await UpdateCounty(id, countyData as County);
      if (updatedCounty) {
        setCounties((prev) =>
          prev.map((county) => (county.id === id ? updatedCounty : county))
        );
        return updatedCounty;
      }
    } catch (err) {
      setError("Error updating county");
      console.error("Error updating county:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCounty = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteCounty(id);
      if (success) {
        setCounties((prev) => prev.filter((county) => county.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting county");
      console.error("Error deleting county:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    counties,
    cities,
    loading,
    error,
    fetchData,
    createCounty,
    updateCounty,
    deleteCounty,
  };
}
