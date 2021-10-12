import * as React from "react";
import { Select } from "../../components/form";
import { schema } from "../gql/client";

export function SelectBoard({ value, onChange, selectSingle = false, onInit = null, ...props }) {
  const boards = schema.useBoardsQuery();

  const placeholder = boards.loading ? "Loading..." : props.placeholder || "Select Board...";

  const options = boards.data?.boards.map((b) => ({ label: b.name, value: b.id })) ?? [];

  React.useEffect(() => {
    if (boards.data?.boards) {
      if (onInit) onInit(boards.data.boards);
      if (selectSingle && options.length == 1 && !value) onChange(options[0].value);
    }
  }, [boards.data]);

  return (
    <Select
      placeholder={placeholder}
      options={options}
      value={options.find((x) => x.value == value) ?? null}
      onChange={(e) => onChange(e.value)}
      isDisabled={selectSingle && options.length == 1 && value == options[0].value}
    />
  );
}

export function SelectStatus({ value, onChange, selectFirst = false, onInit = null, ...props }) {
  const statuses = schema.useStatusesQuery();

  const placeholder = statuses.loading ? "Loading..." : props.placeholder || "Select Status...";

  const options =
    statuses.data?.statuses.map((b) => ({
      label: b.name,
      value: b.id,
    })) ?? [];

  React.useEffect(() => {
    if (statuses.data?.statuses) {
      if (onInit) onInit(statuses.data.statuses);
      if (selectFirst && options.length && !value) onChange(options[0].value);
    }
  }, [statuses.data]);

  return (
    <Select placeholder={placeholder} options={options} value={options.find((x) => x.value == value) ?? null} onChange={(e) => onChange(e.value)} />
  );
}

export function SelectMember({ project, value, onChange, onInit = null, isClearable = false, ...props }) {
  const members = schema.useMembersQuery();

  const placeholder = members.loading ? "Loading..." : props.placeholder || "Select Member...";

  const options =
    members.data?.members.map((b) => ({
      label: b.displayName,
      value: b.id,
    })) ?? [];

  React.useEffect(() => {
    if (members.data?.members) {
      if (onInit) onInit(members.data.members);
    }
  }, [members.data]);

  return (
    <Select
      placeholder={placeholder}
      options={options}
      value={options.find((x) => x.value == value) ?? null}
      onChange={(e) => onChange(e?.value ?? null)}
      isClearable={isClearable}
    />
  );
}
