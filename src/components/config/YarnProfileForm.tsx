"use client";

import { MaterialMixEditor } from "@/src/components/MaterialMixEditor";
import type { YarnProfile, YarnWeightUnit } from "@/src/lib/domain";

type Props = {
  profile: YarnProfile;
  onChange: (profile: YarnProfile) => void;
};

export function YarnProfileForm({ profile, onChange }: Props) {
  return (
    <>
      <div className="field-grid">
        <label className="field">
          <span>Manufacturer *</span>
          <input
            type="text"
            value={profile.manufacturer}
            onChange={(event) =>
              onChange({ ...profile, manufacturer: event.target.value })
            }
          />
        </label>
        <label className="field">
          <span>Weight</span>
          <select
            value={profile.weight}
            onChange={(event) =>
              onChange({
                ...profile,
                weight: event.target.value as YarnWeightUnit,
              })
            }
          >
            <option value="fingering">Fingering</option>
            <option value="DK">DK</option>
            <option value="worsted">Worsted</option>
          </select>
        </label>
      </div>
      <MaterialMixEditor
        materials={profile.materials}
        onChange={(materials) => onChange({ ...profile, materials })}
      />
    </>
  );
}
