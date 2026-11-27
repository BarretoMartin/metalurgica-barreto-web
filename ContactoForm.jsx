import { useState } from "react";

const INITIAL_FORM_STATE = {
  nombre: "",
  telefono: "",
  email: "",
  tipoTrabajo: "",
  mensaje: "",
};

const WORK_TYPES = [
  "Estructuras Residenciales",
  "Zinguería / Canaletas",
  "Corte Láser",
  "Extractores Eólicos",
  "Herrería General",
];

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyewoljd";

/**
 * Formulario de contacto para Metalúrgica Barreto conectado a Formspree.
 * @param {{ formspreeEndpoint?: string }} props
 */
export default function ContactoForm({
  formspreeEndpoint = FORMSPREE_ENDPOINT,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const isLoading = status === "loading";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          email: formData.email.trim(),
          tipoTrabajo: formData.tipoTrabajo,
          mensaje: formData.mensaje.trim(),
          _subject: `Nueva consulta web - ${formData.tipoTrabajo || "Metalúrgica Barreto"}`,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiError = Array.isArray(data?.errors)
          ? data.errors.map((err) => err.message).join(", ")
          : null;
        throw new Error(
          apiError ||
            "No pudimos enviar tu consulta en este momento. Intentá nuevamente o escribinos por WhatsApp."
        );
      }

      setFormData(INITIAL_FORM_STATE);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : "Ocurrió un error de conexión al enviar el formulario."
      );
    }
  };

  const inputBaseClasses =
    "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-inner transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-60";

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl shadow-black/60 backdrop-blur-sm sm:p-8">
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
          Presupuestos sin cargo
        </span>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Solicitá tu presupuesto
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          Contanos sobre tu obra y te respondemos a la brevedad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre completo */}
        <div>
          <label
            htmlFor="nombre"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
            Nombre completo
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            disabled={isLoading}
            autoComplete="name"
            placeholder="Tu nombre o empresa"
            value={formData.nombre}
            onChange={handleChange}
            className={inputBaseClasses}
          />
        </div>

        {/* Teléfono/WhatsApp y Email en 2 columnas en pantallas >= sm */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="telefono"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
              Teléfono / WhatsApp
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              disabled={isLoading}
              autoComplete="tel"
              placeholder="Ej: 3455 416879"
              value={formData.telefono}
              onChange={handleChange}
              className={inputBaseClasses}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
              autoComplete="email"
              placeholder="nombre@correo.com"
              value={formData.email}
              onChange={handleChange}
              className={inputBaseClasses}
            />
          </div>
        </div>

        {/* Tipo de Trabajo */}
        <div>
          <label
            htmlFor="tipoTrabajo"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
            Tipo de Trabajo
          </label>
          <select
            id="tipoTrabajo"
            name="tipoTrabajo"
            required
            disabled={isLoading}
            value={formData.tipoTrabajo}
            onChange={handleChange}
            className={`${inputBaseClasses} cursor-pointer ${
              formData.tipoTrabajo === "" ? "text-zinc-500" : "text-zinc-100"
            }`}
          >
            <option value="" disabled className="bg-zinc-950 text-zinc-500">
              Seleccioná una categoría...
            </option>
            {WORK_TYPES.map((workType) => (
              <option
                key={workType}
                value={workType}
                className="bg-zinc-950 text-zinc-100"
              >
                {workType}
              </option>
            ))}
          </select>
        </div>

        {/* Detalles de la obra */}
        <div>
          <label
            htmlFor="mensaje"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
            Detalles de la obra
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={4}
            required
            disabled={isLoading}
            placeholder="Contanos medidas aproximadas, ubicación, tipo de estructura, chapa o trabajo a realizar..."
            value={formData.mensaje}
            onChange={handleChange}
            className={`${inputBaseClasses} min-h-[130px] resize-y`}
          />
        </div>

        {/* Mensaje de éxito */}
        {status === "success" && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-emerald-300">
                ¡Consulta enviada con éxito!
              </p>
              <p className="mt-0.5 text-emerald-200/80">
                Gracias por comunicarte con Metalúrgica Barreto. Nos pondremos
                en contacto con vos muy pronto.
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {status === "error" && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-red-300">
                No se pudo enviar el mensaje
              </p>
              <p className="mt-0.5 text-red-200/80">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:brightness-105 hover:shadow-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-zinc-950"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Enviando consulta...
            </>
          ) : (
            "Enviar mensaje"
          )}
        </button>
      </form>
    </div>
  );
}
