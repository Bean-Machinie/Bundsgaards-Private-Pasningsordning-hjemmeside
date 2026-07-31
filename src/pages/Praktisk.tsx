import { useId, useState } from 'react';
import { MotionConfig, motion, type Variants } from 'motion/react';

import Backdrop from '../components/Backdrop';
import { ArrowRightIcon } from '../components/Icons';
import { faqIntro, faqs } from '../content/faqs';
import { practicalNotes, practicalPanels } from '../content/practical';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gridMin } from '../lib/css';
import { scrollToContact } from '../lib/scrollToContact';
import { routes } from '../routes';

import './Praktisk.css';

/* — FAQ choreography ————————————————————————————————————————————————
   The band is built to the Motion UI "FAQ: plus-minus" section, and that
   includes how it arrives: heading, lead, every row and the closing line each
   rise 24px into place, one just behind the last, the first time the band is
   scrolled into view. The easing is the same out-quint the example uses for its
   hover transitions and the header already uses for its menus. */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const bandVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/* The answer is uncovered rather than cropped: --faq-reveal drives a one-stop
   gradient mask (see .faq__panel) that travels down in step with the height, so
   the bottom edge of the text is soft while the row is moving. Opening is the
   slower half of the pair — a panel that snaps shut feels tidy, one that snaps
   open feels abrupt. */
const panelVariants: Variants = {
  open: {
    height: 'auto',
    '--faq-reveal': '100%',
    transition: { duration: 0.34, ease: EASE_OUT },
  },
  closed: {
    height: 0,
    '--faq-reveal': '0%',
    transition: { duration: 0.26, ease: EASE_OUT },
  },
};

/* The text settles just after the box that holds it, so the row opens and the
   answer focuses into the space rather than riding down with the edge. */
const answerVariants: Variants = {
  open: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: EASE_OUT, delay: 0.05 },
  },
  closed: {
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.16, ease: EASE_OUT },
  },
};

export default function Praktisk() {
  useDocumentTitle(routes.praktisk.title);

  // One answer open at a time, as in the prototype — and the first row starts
  // open, as it does in the example. -1 means all closed.
  const [openFaq, setOpenFaq] = useState(0);
  const faqId = useId();

  return (
    <div className="enter">
      {/* Everything on cream is one host for the printed backdrop — it has to
          reach from under the site header down to the opaque FAQ band, exactly
          as the Hverdagen page's single section does. See .backdrop-host in
          Backdrop.css for why this page's layer needs that treatment. */}
      <div className="backdrop-host">
        <Backdrop variant="welcome" />

        <section className="shell section--loose section--page-top section--flush-bottom">
          <h1 className="title-page">
            Praktisk <em className="title-em">information</em>
          </h1>
          <p className="lead lead--page">
            Er der noget, der ikke står her, så spørg endelig. Jeg svarer hellere en gang
            for meget.
          </p>
        </section>

        <section className="shell section">
          <div className="grid" style={gridMin('250px')}>
            {practicalPanels.map((panel) => (
              <div key={panel.title} className="panel">
                <h2 className="praktisk__panel-title">{panel.title}</h2>
                {panel.intro && <p className="praktisk__panel-intro">{panel.intro}</p>}
                {panel.rows.map((row) => (
                  <div key={row.label} className="spec-row">
                    <span>{row.label}</span>
                    <span className={row.muted ? 'muted' : undefined}>{row.value}</span>
                  </div>
                ))}
                {panel.footnote && <p className="praktisk__footnote">{panel.footnote}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="shell section section--flush-top">
          <div className="grid" style={gridMin('240px')}>
            {practicalNotes.map((note) => (
              <div key={note.title}>
                <h2 className="praktisk__note-title">{note.title}</h2>
                <p className="praktisk__note-body">{note.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* reducedMotion="user" leaves the fades but drops the rises and the
          height travel for anyone who asked the OS for less movement — the same
          treatment the header's menus get. */}
      <MotionConfig reducedMotion="user">
        <motion.section
          className="band band--surface"
          aria-labelledby={`${faqId}-heading`}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.15 }}
          variants={bandVariants}
        >
          {/* Its own centred column rather than the page shell: the example is a
              672px measure, narrower than .shell--narrow, and centred copy over
              full-width rows is the whole shape of it. */}
          <div className="faq-section">
            <motion.h2
              id={`${faqId}-heading`}
              className="faq-section__title"
              variants={riseVariants}
            >
              {faqIntro.title}
            </motion.h2>
            <motion.p className="faq-section__lead" variants={riseVariants}>
              {faqIntro.lead}
            </motion.p>

            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                const panelId = `${faqId}-panel-${index}`;
                const buttonId = `${faqId}-button-${index}`;

                return (
                  <motion.div key={faq.question} className="faq" variants={riseVariants}>
                    <h3 className="faq__heading">
                      <button
                        type="button"
                        id={buttonId}
                        className="faq__trigger"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      >
                        <span>{faq.question}</span>
                        {/* Two bars, both centred in the box: the second stands
                            upright for a plus and lies down over the first for a
                            minus. */}
                        <span className="faq__icon" aria-hidden="true">
                          <span className="faq__bar" />
                          <motion.span
                            className="faq__bar"
                            animate={{ rotate: isOpen ? 0 : 90 }}
                            transition={{ duration: 0.3, ease: EASE_OUT }}
                          />
                        </span>
                      </button>
                    </h3>
                    {/* Kept mounted so both directions can play; `inert` makes
                        the folded panel unreachable by tab, pointer and screen
                        reader, and keeps aria-controls pointing at something. */}
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="faq__panel"
                      inert={!isOpen}
                      initial={false}
                      animate={isOpen ? 'open' : 'closed'}
                      variants={panelVariants}
                    >
                      <motion.p className="faq__answer" variants={answerVariants}>
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <motion.p className="faq-section__foot" variants={riseVariants}>
              <span>{faqIntro.footPrompt}</span>
              <a
                href="#kontakt"
                className="faq-section__link"
                onClick={scrollToContact}
              >
                {faqIntro.footLink}
                <ArrowRightIcon size={16} />
              </a>
            </motion.p>
          </div>
        </motion.section>
      </MotionConfig>
    </div>
  );
}
