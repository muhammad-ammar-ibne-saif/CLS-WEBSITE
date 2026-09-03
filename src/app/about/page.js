import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">COMSATS Literary Society Is One of The Leading Societies In Campus</h1>
            <p className="lede">
              Spreading across 8+ departments with a history of 50+ successful events, CLS is one of the most recognized and celebrated societies of COMSATS.
            </p>
          </div>
          <div className="stats">
            <div className="stat">
              <strong>2016</strong>
              <span>Est. since</span>
            </div>
            <div className="stat">
              <strong>110</strong>
              <span>Events done</span>
            </div>
            <div className="stat">
              <strong>200+</strong>
              <span>Members</span>
            </div>
            <div className="stat">
              <strong>4</strong>
              <span>Awards</span>
            </div>
          </div>
        </div>
      </section>

      <section className="banner-frame pattern-edges">
        <img className="banner" src="/assets/about-banner.png" alt="A CLS speaker addressing an audience" />
      </section>
      <div className="pattern-bottom" />

      <section className="section story">
        <div className="wrap stack">
          <p className="eyebrow">OUR STORY</p>
          <h2 className="headline center">Motivation Behind Building CLS</h2>
          <p className="center">
            Every meaningful journey begins with a question. Ours was simple: What if every student who carried stories, poems, ideas, or unspoken thoughts had a place where they truly belonged? From that question, COMSATS Literary Society (CLS) was born
            <span>
              —not merely as a student society, but as a home for expression, curiosity, and meaningful conversation. We envisioned a community where literature is not confined to bookshelves or classrooms, but lives in the voices of those who dare to imagine, write, question, and create. CLS exists to celebrate the timeless power of words, to nurture emerging writers and readers, and to preserve the culture of thoughtful dialogue in an age of constant noise. Here, every poem, every essay, every story, and every conversation becomes part of a shared legacy that grows with each new member. Our story is still being written, and every person who joins adds a page that could inspire someone else tomorrow. Because in the end, CLS is not defined by the events we host or the pages we publish—it is defined by the people who choose to leave a piece of themselves in every word they share.
            </span>
          </p>
          <img className="calligraphy lg" src="/assets/calligraphy-story.png" alt="Urdu couplet" />
          <Ornament />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap stack">
          <div className="page-head">
            <p className="eyebrow">OUR VALUES</p>
            <h2 className="headline">What CLS Stands For</h2>
          </div>
          <div className="values">
            <article className="value-card">
              <img src="/assets/flower-literature.png" alt="" width={80} height={80} />
              <h3>Literature</h3>
              <p>The reason we exist. We celebrate the power of words to preserve ideas, awaken emotions, and connect people across generations.</p>
            </article>
            <article className="value-card">
              <img src="/assets/flower-inspiration.png" alt="" width={80} height={80} />
              <h3>Inspiration</h3>
              <p>The legacy that guides us. We draw strength from the timeless works of poets, authors, and thinkers who remind us that words can shape the world.</p>
            </article>
            <article className="value-card">
              <img src="/assets/flower-vision.png" alt="" width={80} height={80} />
              <h3>Vision</h3>
              <p>The force that moves us forward. We strive to build a community where every voice finds the confidence to read, write, and inspire.</p>
            </article>
          </div>
          <Link className="btn" href="/leadership">See Our Leadership</Link>
        </div>
      </section>
    </SiteShell>
  );
}
