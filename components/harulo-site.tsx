import Link from "@/components/site-link";
import { ArrowRight } from "lucide-react";
import { studio } from "@/lib/site-content";
import { getPublicPublications } from "@/lib/publishing/catalog";
import { SoftwareOrigin } from "./brand/software-origin";
import { CopyEmail } from "./copy-email";
import { Direction, FoldMark } from "./publisher-mark";
import { ProductEdition } from "./product-edition";
import { BrandScene } from "./brand/scene/brand-scene";
import { HaruloEnvironment } from "./brand/environments/harulo-environment";
import { brandCopy } from "@/lib/brand/copy";

export function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-top">
        <p className="eyebrow">CONTACT / TODAY → TOWARD</p>
      </div>
      <h2 id="contact-title">{brandCopy.contact}<Direction /></h2>
      <div className="contact-bottom">
        <p>A recurring frustration. A question. A possibility.<br />We’re listening.</p>
        <div className="contact-details">
          <a className="email-link" href={`mailto:${studio.email}`}><span>{studio.email}</span><Direction /></a>
          <CopyEmail email={studio.email} />
        </div>
      </div>
    </section>
  );
}

export function StudioStory() {
  return (
    <BrandScene className="meaning-scene" systems="03 10 18 23">
      <HaruloEnvironment material="day-next" />
      <section className="story-section" id="studio" aria-labelledby="story-title">
        <div className="story-index metadata">02 / THE DIRECTION</div>
        <div className="story-copy">
          <h2 id="story-title">{brandCopy.meaningLiteral}</h2>
          <p className="meaning-poetic">{brandCopy.meaningPoetic}</p>
        </div>
        <div className="korean-direction" lang="ko"><span>하루</span><ArrowRight aria-hidden="true" /><span>로</span></div>
      </section>
    </BrandScene>
  );
}

export function MakingSection() {
  return (
    <section className="making-section">
      <div className="making-intro">
        <p className="eyebrow">03 / A CONTINUOUS PRACTICE</p>
        <h2>OBSERVE.<br />BUILD.<br /><em>PUBLISH.</em></h2>
        <FoldMark />
      </div>
      <div className="making-body">
        <p className="making-lead">{brandCopy.philosophy}</p>
        <p>Software becomes part of someone’s day. We take that seriously. Every release is a beginning. Every improvement is a reason to keep going.</p>
        <ol className="making-principles">
          {studio.principles.map((p) => <li key={p.number}><span className="metadata">{p.number}</span><div><h3>{p.title}</h3><p>{p.body}</p></div></li>)}
        </ol>
        <div className="making-cycle" aria-label="Our process"><span>Observe</span><Direction /><span>Build</span><Direction /><span>Publish</span><Direction /><span>Improve</span><span className="cycle-again">↺</span></div>
      </div>
    </section>
  );
}

export function HaruloSite({ prefix = "", hero }: { prefix?: string; hero?: React.ReactNode }) {
  const { verified, showcase } = getPublicPublications();
  const products = [...verified, ...showcase];
  return (
    <main id="main" tabIndex={-1} className="harulo-world">
      {hero ?? <div className="hero-scene">
        <section className="publisher-hero" aria-labelledby="hero-title">
          <div className="hero-mast"><p className="publisher-eyebrow eyebrow">{studio.role}</p></div>
          <div className="hero-world">
            <div className="hero-statement"><h1 id="hero-title">{brandCopy.hero}</h1><p className="hero-description">{studio.description}</p><div className="hero-actions"><Link className="primary-link" href={`${prefix}/software`}>Explore software <Direction /></Link><Link className="quiet-link" href={`${prefix}/studio`}>Studio <Direction /></Link></div></div>
            <SoftwareOrigin />
          </div>
        </section>
      </div>}
      <section className="software-section" id="software" aria-labelledby="software-title">
        <div className="section-heading"><p className="eyebrow">01 / SOFTWARE</p></div>
        <h2 id="software-title" className="catalog-title">{brandCopy.catalog}</h2>
        {showcase.length > 0 && <p className="showcase-disclosure">Five local interactive concepts, not released software.</p>}
        <div className="publisher-shelf">{products.map((product) => <ProductEdition key={product.id} product={product} prefix={prefix} variant="home" />)}</div>
        <Link className="catalog-all" href={`${prefix}/software`}>OPEN THE SHOWCASE <Direction /></Link>
      </section>
      <StudioStory />
      <MakingSection />
      <ContactSection />
    </main>
  );
}
