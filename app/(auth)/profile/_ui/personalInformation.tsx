import { Admin } from "@/types";
import { CardWrapper } from "@/ui/cards/card";
import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import { Mail, MapPin, User } from "lucide-react";
import Input from "@/ui/inputs/input";
import Select from "@/ui/inputs/select";

type Props = {
  isEditing: boolean;
  formData: Partial<Admin>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string | number) => void;
  data: Admin;
  countries: Array<{ id: number; country: string }>;
  regions: Array<{ id: number; region: string }>;
  cities: Array<{ id: number; city: string }>;
  counties: Array<{ id: number; county: string }>;
};

export default function PersonalInformation({
  isEditing,
  formData,
  handleInputChange,
  handleSelectChange,
  data,
  countries,
  regions,
  cities,
  counties,
}: Props) {
  console.log("data:: ", data);

  return (
    <CardWrapper variant="elevated" className="!min-h-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center">
          <User className="text-white" size={24} />
        </div>
        <Title variant="h4" className="font-bold">
          Información Personal
        </Title>
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                type="text"
                icon={User}
                placeholder="Nombre"
              />
              <Input
                label="Apellido(s)"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleInputChange}
                type="text"
                icon={User}
                placeholder="Apellido(s)"
              />
            </div>

            {/* Email */}
            <Input
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              type="email"
              icon={Mail}
              placeholder="email"
            />

            {/* Location Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-gray-600 dark:text-gray-400" />
                <Text variant="label" className="font-semibold text-gray-700 dark:text-gray-300">
                  Ubicación
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="País"
                  name="countryId"
                  value={formData.country?.id || ""}
                  onChange={(value) => handleSelectChange("countryId", value)}
                  options={countries.map((c) => ({ label: c.country, value: c.id }))}
                  placeholder="Selecciona un país"
                  icon={MapPin}
                  dropdownDirection="up"
                />

                <Select
                  label="Región"
                  name="regionId"
                  value={formData.region?.id || ""}
                  onChange={(value) => handleSelectChange("regionId", value)}
                  options={regions.map((r) => ({ label: r.region, value: r.id }))}
                  placeholder="Selecciona una región"
                  icon={MapPin}
                  disabled={!formData.countryId}
                  dropdownDirection="up"
                />

                <Select
                  label="Ciudad"
                  name="cityId"
                  value={formData.city?.id || ""}
                  onChange={(value) => handleSelectChange("cityId", value)}
                  options={cities.map((c) => ({ label: c.city, value: c.id }))}
                  placeholder="Selecciona una ciudad"
                  icon={MapPin}
                  disabled={!formData.regionId}
                  dropdownDirection="up"
                />

                <Select
                  label="Comuna"
                  name="countyId"
                  value={formData.county?.id || ""}
                  onChange={(value) => handleSelectChange("countyId", value)}
                  options={counties.map((c) => ({ label: c.county, value: c.id }))}
                  placeholder="Selecciona una comuna"
                  icon={MapPin}
                  disabled={!formData.cityId}
                  dropdownDirection="up"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Display Mode - Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
                  Nombre
                </Text>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Text variant="p" className="font-medium">
                    {data.name}
                  </Text>
                </div>
              </div>
              <div className="space-y-2">
                <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
                  Apellido(s)
                </Text>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Text variant="p" className="font-medium">
                    {data.lastName || "N/A"}
                  </Text>
                </div>
              </div>
            </div>

            {/* Display Mode - Email */}
            <div className="space-y-2">
              <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
                Correo Electrónico
              </Text>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Text variant="p" className="font-medium">
                  {data.email}
                </Text>
              </div>
            </div>

            {/* Display Mode - Location */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-gray-600 dark:text-gray-400" />
                <Text variant="label" className="font-semibold text-gray-700 dark:text-gray-300">
                  Ubicación
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.country?.id && (
                  <div className="space-y-2">
                    <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
                      País
                    </Text>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Text variant="p" className="font-medium">
                        {data.country?.country}
                      </Text>
                    </div>
                  </div>
                )}

                {data.region?.id && (
                  <div className="space-y-2">
                    <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
                      Región
                    </Text>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Text variant="p" className="font-medium">
                        {data.region?.region}
                      </Text>
                    </div>
                  </div>
                )}

                {data.city?.id && (
                  <div className="space-y-2">
                    <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
                      Ciudad
                    </Text>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Text variant="p" className="font-medium">
                        {data.city?.city}
                      </Text>
                    </div>
                  </div>
                )}

                {data.county?.id && (
                  <div className="space-y-2">
                    <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
                      Comuna
                    </Text>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Text variant="p" className="font-medium">
                        {data.county?.county}
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </CardWrapper>
  );
}
