"use client";

import { useState } from "react";
import { MaterialMixEditor } from "@/src/components/MaterialMixEditor";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/src/components/SavedItemsControl";
import {
  DEFAULT_YARN_PROFILE,
  type YarnProfile as YarnProfileData,
  type YarnWeightUnit,
} from "@/src/lib/domain";
import { deleteYarnProfile, type LibraryItem } from "@/src/lib/library";
import { validateYarnProfile } from "@/src/lib/validation";

type Props = {
  profile: YarnProfileData;
  profileId?: string;
  onChange: (update: Partial<YarnProfileData>) => void;
  onSelect: (profile: YarnProfileData, profileId?: string) => void;
};

export function YarnProfile({ profile, profileId, onChange, onSelect }: Props) {
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);
  const errors = validateYarnProfile(profile);

  function handleDelete(id: string) {
    deleteYarnProfile(id);
    if (id === profileId) onSelect(DEFAULT_YARN_PROFILE, undefined);
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div className="section-heading-main">
          <span className="step">02</span>
          <div>
            <h2>
              Yarn profile
              {loadedItem && (
                <span className="loaded-item-name">
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </span>
              )}
            </h2>
            <p>Save a profile to link tensions to this yarn.</p>
          </div>
        </div>
        <SavedItemsControl
          type="yarnProfile"
          data={profile}
          defaultData={DEFAULT_YARN_PROFILE}
          onLoad={(data, item?: LibraryItem<YarnProfileData>) =>
            onSelect(data, item?.id)
          }
          onSaved={(item) => onSelect(item.data, item.id)}
          onDelete={handleDelete}
          onLoadedItemChange={setLoadedItem}
        />
      </div>
      <div className="field-grid">
        <label className="field">
          <span>Manufacturer *</span>
          <input
            type="text"
            value={profile.manufacturer}
            onChange={(event) => onChange({ manufacturer: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Weight</span>
          <select
            value={profile.weight}
            onChange={(event) =>
              onChange({ weight: event.target.value as YarnWeightUnit })
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
        onChange={(materials) => onChange({ materials })}
      />
      {errors.length > 0 && <p className="hint">{errors[0]}</p>}
    </section>
  );
}
