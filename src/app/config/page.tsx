import Link from "next/link";
import { ConfigShell } from "@/src/components/config/ConfigShell";

export default function ConfigIndexPage() {
  return (
    <ConfigShell title="Configuration">
      <section className="panel">
        <ul className="config-list">
          <li className="config-list-item">
            <div>
              <strong>Foot sizes</strong>
              <p className="hint">Saved foot measurements.</p>
            </div>
            <div className="top-actions">
              <Link className="button secondary" href="/config/foot-sizes">
                Manage
              </Link>
              <Link className="button" href="/config/foot-sizes/new">
                Create new
              </Link>
            </div>
          </li>
          <li className="config-list-item">
            <div>
              <strong>Yarn profiles</strong>
              <p className="hint">
                Saved yarn manufacturers, weights and mixes.
              </p>
            </div>
            <div className="top-actions">
              <Link className="button secondary" href="/config/yarn-profiles">
                Manage
              </Link>
              <Link className="button" href="/config/yarn-profiles/new">
                Create new
              </Link>
            </div>
          </li>
        </ul>
      </section>
    </ConfigShell>
  );
}
