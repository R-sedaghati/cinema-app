"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Switch } from "@dgshahr/ui-kit";
import { Pencil, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SMS_MODE_LABEL, SMS_RECIPIENT_SHORT } from "@/lib/constants/sms/events";
import {
  useAdminSmsRuleList,
  useAdminSmsRuleUpdate,
  useAdminSmsTriggerList,
} from "@/lib/services/admin/hook";
import { ISmsRule, ISmsTrigger } from "@/lib/services/admin/type";
import withNoSSR from "@/lib/utils/withNoSSR";
import SmsRuleDrawer from "./SmsRuleDrawer";

/**
 * Every place an SMS can be attached to, grouped by section of the flow, with the
 * messages set up for it. A message is added to a flow with its «افزودن»; removing or
 * pausing it is on the message itself.
 */
function SmsRuleTable() {
  const queryClient = useQueryClient();
  const { data: triggerData, isPending: triggersPending } = useAdminSmsTriggerList();
  const { data: ruleData, isPending: rulesPending } = useAdminSmsRuleList();
  const { mutate: updateRule } = useAdminSmsRuleUpdate();

  const [drawer, setDrawer] = useState<{ rule: ISmsRule | null; trigger: string | null } | null>(null);
  /** Guards the row whose switch is in flight against a second click. */
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const triggers = useMemo(() => triggerData?.result ?? [], [triggerData]);
  const rules = useMemo(() => ruleData?.result ?? [], [ruleData]);

  const groups = useMemo(() => {
    const byGroup = new Map<string, ISmsTrigger[]>();
    triggers.forEach((t) => byGroup.set(t.group, [...(byGroup.get(t.group) ?? []), t]));
    return [...byGroup.entries()];
  }, [triggers]);

  const handleToggle = (rule: ISmsRule) => {
    setTogglingId(rule.id);

    updateRule(
      { id: rule.id, payload: { isActive: !rule.isActive } },
      {
        onSuccess: () => {
          toast.success(rule.isActive ? "ارسال این پیامک غیرفعال شد" : "ارسال این پیامک فعال شد");
          queryClient.invalidateQueries({ queryKey: ["smsRuleList"] });
        },
        onError: () => toast.error("خطا در تغییر وضعیت پیامک"),
        onSettled: () => setTogglingId(null),
      },
    );
  };

  if (triggersPending || rulesPending) {
    return <div className="animate-pulse h-40 rounded-xl bg-gray-100" />;
  }

  return (
    <div className="ss02 mb-5 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3">
        <p className="font-p2-regular text-gray-500">
          {`${rules.length} پیامک در ${triggers.length} مرحله تنظیم شده است.`}
        </p>
        <Button
          variant="primary"
          color="error"
          rightIcon={<Plus />}
          onClick={() => setDrawer({ rule: null, trigger: null })}
        >
          افزودن پیامک
        </Button>
      </div>

      {groups.map(([group, items]) => (
        <section key={group} className="flex flex-col gap-3">
          <h3 className="font-h6-bold">{group}</h3>

          {items.map((trigger) => {
            const triggerRules = rules.filter((r) => r.trigger === trigger.key);

            return (
              <div key={trigger.key} className="rounded-xl border border-gray-200">
                <div className="flex flex-col gap-2 p-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="font-p1-medium">{trigger.label}</p>
                    <p className="font-p2-regular text-gray-500">{trigger.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    color="error"
                    rightIcon={<Plus />}
                    onClick={() => setDrawer({ rule: null, trigger: trigger.key })}
                  >
                    افزودن
                  </Button>
                </div>

                {triggerRules.length === 0 ? (
                  <p className="border-t border-gray-200 px-4 py-3 font-p2-regular text-gray-500">
                    پیامکی برای این مرحله تنظیم نشده است.
                  </p>
                ) : (
                  triggerRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-p1-medium">{rule.name || trigger.label}</p>
                          <Badge value={SMS_RECIPIENT_SHORT[rule.recipient]} type="twoTone" color="primary" />
                          <Badge
                            value={rule.mode === "PATTERN" ? `الگو ${rule.patternBodyId}` : SMS_MODE_LABEL.TEXT}
                            type="twoTone"
                            color={rule.mode === "PATTERN" ? "success" : "gray"}
                          />
                          {!rule.isActive && <Badge value="غیرفعال" type="twoTone" color="error" />}
                        </div>
                        <p className="font-p2-regular line-clamp-2 max-w-3xl whitespace-pre-wrap text-gray-600">
                          {rule.body}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Switch
                          checked={rule.isActive}
                          disabled={togglingId === rule.id}
                          onChange={() => handleToggle(rule)}
                        />
                        <Button
                          onClick={() => setDrawer({ rule, trigger: rule.trigger })}
                          variant="outline"
                          color="error"
                          rightIcon={<Pencil />}
                        >
                          ویرایش
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </section>
      ))}

      <SmsRuleDrawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        triggers={triggers}
        rule={drawer?.rule ?? null}
        presetTrigger={drawer?.trigger ?? null}
      />
    </div>
  );
}

export default withNoSSR(SmsRuleTable);
