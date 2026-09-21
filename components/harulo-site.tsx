import Link from "@/components/site-link";
import { ArrowRight } from "lucide-react";
import { studio } from "@/lib/site-content";
import { showcaseCatalog } from "@/lib/publishing/showcase";
import type { PublisherCatalog } from "@/lib/publishing/types";
import { SoftwareOrigin } from "./brand/software-origin";
import { CopyEmail } from "./copy-email";
import { Direction, FoldMark } from "./publisher-mark";
import { ProductEdition } from "./product-edition";
import { BrandScene } from "./brand/scene/brand-scene";
import { HaruloEnvironment } from "./brand/environments/harulo-environment";

export function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-top">
        <p className="eyebrow">THERE IS ALWAYS A NEXT DAY.</p>
        <span className="metadata" lang="ko">조금 더 나은 하루로.</span>
      </div>
      <h2 id="contact-title">WHAT COULD<br />BE <em>BETTER?</em><Direction /></h2>
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

export function StudioStory({ full = false }: { full?: boolean }) {
  return (
    <section className="story-section" id="studio" aria-labelledby="story-title">
      <div className="story-index metadata">02 / THE DIRECTION</div>
      <div className="story-copy">
        <p className="eyebrow">HARULO · 하루로</p>
        <h2 id="story-title">Not another app.<br /><em>A better everyday.</em></h2>
        <p><span lang="ko">하루</span> means a day. In <span lang="ko">하루로</span>, we find a direction: toward a day that feels a little better.</p>
        <p>We start with the thing you do again and again. The unnecessary step. The small interruption. Then we build software that gets it out of your way.</p>
        {full && <p>Harulo Studio is an independent software publisher, built by one maker. We design, build, publish and maintain our own products—carefully, and in public when the work is ready.</p>}
      </div>
      <div className="korean-direction" lang="ko"><span>하루</span><ArrowRight aria-hidden="true" /><span>하루<b>로</b></span></div>
      <div className="language-labels metadata"><span>A DAY</span><span>TOWARD A BETTER DAY</span></div>
    </section>
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
        <p className="making-lead">Published is not finished.</p>
        <p>Software becomes part of someone’s day. We take that seriously. Every release is a beginning. Every improvement is a reason to keep going.</p>
        <ol className="making-principles">
          {studio.principles.map((p) => <li key={p.number}><span className="metadata">{p.number}</span><div><h3>{p.title}</h3><p>{p.body}</p></div></li>)}
        </ol>
        <div className="making-cycle" aria-label="Our process"><span>Observe</span><Direction /><span>Build</span><Direction /><span>Publish</span><Direction /><span>Improve</span><span className="cycle-again">↺</span></div>
      </div>
    </section>
  );
}

export function HaruloSite({ prefix = "", hero }: { prefix?: string; catalog?: PublisherCatalog; hero?: React.ReactNode }) {
  const products = showcaseCatalog.products;
  return (
    <main id="main" tabIndex={-1} className="harulo-world">
      {hero ?? <BrandScene className="hero-scene" systems="01 02 03 04 05 09 13 17 18 23">
        <HaruloEnvironment material="flow" />
        <section className="publisher-hero" aria-labelledby="hero-title">
          <div className="hero-mast"><p className="publisher-eyebrow eyebrow">{studio.role}</p><span className="metadata">WE DESIGN. BUILD. PUBLISH. MAINTAIN.</span></div>
          <div className="hero-world">
            <div className="hero-statement"><h1 id="hero-title"><span className="sr-only">Harulo Studio. </span>Software,<br /><em>toward</em><br />a better day.</h1><p className="hero-korean" lang="ko">조금 더 나은 하루로.</p></div>
            <SoftwareOrigin />
          </div>
          <div className="hero-bottom"><p className="hero-signature">HARULO<span>STUDIO / <span lang="ko">하루로</span></span></p><div className="hero-introduction"><p className="hero-description">{studio.description}</p><div className="hero-actions"><Link className="primary-link" href={`${prefix}/software`}>Explore the showcase <Direction /></Link><a className="quiet-link" href="#contact">Say hello <Direction /></a></div></div></div>
        </section>
      </BrandScene>}
      <section className="software-section" id="software" aria-labelledby="software-title">
        <div className="section-heading"><p className="eyebrow">01 / SOFTWARE, PUBLISHED.</p><span className="metadata">05 SHOWCASE PUBLICATIONS / ONE PUBLISHER</span></div>
        <h2 id="software-title" className="catalog-title">Small software.<br /><span>More <em>day.</em></span></h2>
        <p className="showcase-disclosure">Five interactive publication studies showing how future Harulo software will be presented. <strong>These are showcase concepts, not released products.</strong></p>
        <div className="publisher-shelf">{products.map((product, index) => <ProductEdition key={product.id} product={product} prefix={prefix} initiallyOpen={index === 0} />)}</div>
        <Link className="catalog-all" href={`${prefix}/software`}>OPEN THE SHOWCASE <Direction /></Link>
      </section>
      <StudioStory />
      <MakingSection />
      <ContactSection />
    </main>
  );
}
