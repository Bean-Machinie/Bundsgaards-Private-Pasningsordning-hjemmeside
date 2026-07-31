import { useId, useState } from 'react';
import { MotionConfig, motion, type Variants } from 'motion/react';

import Backdrop from '../components/Backdrop';
import { ArrowRightIcon } from '../components/Icons';
import Skeleton from '../components/Skeleton';
import { FAQ_ANCHOR, faqFoot } from '../content/faqs';
import type { SpecPanel } from '../content/practical';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gridMin } from '../lib/css';
import { scrollToContact } from '../lib/scrollToContact';
import { useSheetStatus, useSiteData } from '../lib/sheet/provider';
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

/* — cards ————————————————————————————————————————————————————————————
   Every card on this page comes from one block of the sheet, so all three of
   them can be emptied by the person who keeps it — and one of them, the holiday
   dates, routinely is: they are settled once a year and unknown until they are.

   An emptied card doesn't disappear and doesn't render a heading over nothing.
   It takes the same treatment the site already gives a photo it doesn't have
   yet — a dashed border over a recessed ground, with a line inside saying what
   is coming — so "we haven't got this yet" looks like a decision either way. */

const CARD_EMPTY_FALLBACK = 'Oplyses ved kontakt.';

function InfoCard({ card }: { card: SpecPanel }) {
  const awaiting = card.rows.length === 0;

  return (
    <div className={awaiting ? 'panel praktisk__panel--awaiting' : 'panel'}>
      <h2 className="praktisk__panel-title">{card.title}</h2>
      {card.intro && <p className="praktisk__panel-intro">{card.intro}</p>}

      {awaiting ? (
        <p className="praktisk__panel-empty">{card.emptyText ?? CARD_EMPTY_FALLBACK}</p>
      ) : (
        card.rows.map((row, index) => (
          <div key={`${index}-${row.label}`} className="spec-row">
            <span>{row.label}</span>
            <span className={row.muted ? 'muted' : undefined}>{row.value}</span>
          </div>
        ))
      )}

      {card.footnote && <p className="praktisk__footnote">{card.footnote}</p>}
    </div>
  );
}

/* — waiting ——————————————————————————————————————————————————————————
   Only reachable if the copy of the sheet compiled into the bundle failed to
   parse (see lib/sheet/provider) — but this page is nothing *but* sheet
   content, so it is the one place where that has to look like something. The
   shapes match what replaces them, right down to the row count, so the page
   doesn't jump when it does. */

function CardSkeleton({ rows, delay }: { rows: number; delay: number }) {
  return (
    <div className="panel">
      <Skeleton className="praktisk__skeleton-title" width="55%" height="24px" delay={delay} />
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="spec-row">
          <Skeleton width="42%" height="15px" delay={delay + index * 80} />
          <Skeleton width="26%" height="15px" delay={delay + index * 80} />
        </div>
      ))}
    </div>
  );
}

function NoteSkeleton({ delay }: { delay: number }) {
  return (
    <div>
      <Skeleton className="praktisk__skeleton-title" width="40%" height="24px" delay={delay} />
      <Skeleton className="praktisk__skeleton-line" height="15px" delay={delay + 60} />
      <Skeleton className="praktisk__skeleton-line" height="15px" delay={delay + 120} />
      <Skeleton
        className="praktisk__skeleton-line"
        width="68%"
        height="15px"
        delay={delay + 180}
      />
    </div>
  );
}

export default function Praktisk() {
  useDocumentTitle(routes.praktisk.title);

  const { cards, notes, faqs } = useSiteData();
  const { status } = useSheetStatus();
  const waiting = status === 'loading';

  // One answer open at a time, as in the prototype — and the first row starts
  // open, as it does in the example. -1 means all closed.
  const [openFaq, setOpenFaq] = useState(0);
  // Rows can be deleted from the sheet while the page is open, which would
  // otherwise leave the index pointing past the end and every row shut.
  const activeFaq = openFaq >= faqs.length ? 0 : openFaq;
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

        {/* Cards come out in the order their blocks appear in the sheet, so
            adding one is adding a block — nothing here counts or names them. */}
        <section className="shell section" aria-busy={waiting}>
          <div className="grid" style={gridMin('250px')}>
            {waiting ? (
              <>
                <CardSkeleton rows={3} delay={0} />
                <CardSkeleton rows={4} delay={100} />
                <CardSkeleton rows={2} delay={200} />
              </>
            ) : (
              /* Indexed, because the key is the block's name and nothing stops
                 the sheet carrying the same one twice. */
              cards.map((card, index) => <InfoCard key={`${index}-${card.key}`} card={card} />)
            )}
          </div>
        </section>

        {/* Unlike the cards, these are prose with no frame of their own, so
            there is nothing to leave standing when they are gone: an empty
            block simply closes the section. */}
        {(waiting || notes.length > 0) && (
          <section className="shell section section--flush-top" aria-busy={waiting}>
            <div className="grid" style={gridMin('240px')}>
              {waiting ? (
                <>
                  <NoteSkeleton delay={0} />
                  <NoteSkeleton delay={90} />
                  <NoteSkeleton delay={180} />
                  <NoteSkeleton delay={270} />
                </>
              ) : (
                notes.map((note, index) => (
                  <div key={`${index}-${note.title}`}>
                    <h2 className="praktisk__note-title">{note.title}</h2>
                    <p className="praktisk__note-body">{note.body}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>

      {/* A band headed "Ofte stillede spørgsmål" with no questions under it is
          worse than no band, so an emptied block closes the section rather than
          leaving the heading over a rule. The footer's link to #faq then lands
          at the top of this page, which is where the answers would have been. */}
      {(waiting || faqs.length > 0) && (
        /* reducedMotion="user" leaves the fades but drops the rises and the
           height travel for anyone who asked the OS for less movement — the same
           treatment the header's menus get. */
        <MotionConfig reducedMotion="user">
          <motion.section
            id={FAQ_ANCHOR}
            className="band band--surface faq-band"
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
                Ofte stillede <em className="title-em">spørgsmål</em>
              </motion.h2>

              <div className="faq-list" aria-busy={waiting}>
                {waiting &&
                  Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="faq praktisk__faq-skeleton">
                      <Skeleton width={`${72 - index * 8}%`} delay={index * 90} />
                    </div>
                  ))}
                {faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  const panelId = `${faqId}-panel-${index}`;
                  const buttonId = `${faqId}-button-${index}`;

                  return (
                    <motion.div
                      key={`${index}-${faq.question}`}
                      className="faq"
                      variants={riseVariants}
                    >
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
                <span>{faqFoot.prompt}</span>
                <a
                  href="#kontakt"
                  className="faq-section__link"
                  onClick={scrollToContact}
                >
                  {faqFoot.link}
                  <ArrowRightIcon size={16} />
                </a>
              </motion.p>
            </div>
          </motion.section>
        </MotionConfig>
      )}
    </div>
  );
}
