#!/usr/bin/env node
/**
 * Fetch KJV for Psalms 2–10, write chapter-data JSON with full commentary,
 * and generate MD + PDF for each chapter.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BIBLE_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(BIBLE_ROOT, "chapter-data", "Psalms");

const SOURCES = [
  "King James Version (public domain)",
  "Matthew Henry, Commentary on the Whole Bible (themes summarized)",
  "Expository themes consistent with MacArthur Study Bible tradition (paraphrased, not quoted)",
];

/** Study content (commentary) keyed by chapter number */
const STUDIES = {
  2: {
    title: "The Messiah King",
    subtitle: "Why do the heathen rage… Kiss the Son",
    context:
      "Psalm 2 is a royal/Messianic psalm that pairs with Psalm 1 as a gateway to the Psalter: Psalm 1 shows the two ways for individuals; Psalm 2 shows the nations’ rebellion against the Lord’s Anointed and the certainty of His reign. Henry and the broader evangelical tradition read it of David’s line and ultimately of Christ—the New Testament cites it of Jesus (Acts 4:25–28; 13:33; Heb 1:5; 5:5). The scene is global: kings plot, heaven answers, the Son is installed on Zion, and the nations are invited to submit.",
    verse_groups: [
      ["1-3", "The nations rage and plot “a vain thing”—empty resistance against the Lord and His Anointed. Rulers unite not for justice but to cast off God’s “bands” and “cords.” Rebellion is presented as coordinated and arrogant, yet the psalm already labels it futile."],
      ["4-6", "Heaven’s response is not panic but sovereign laughter and derision (v. 4), then wrathful speech (v. 5). God’s decree stands: “Yet have I set my king upon my holy hill of Zion” (v. 6). Human plots cannot unseat the King God installs."],
      ["7-9", "The Anointed recites the decree: “Thou art my Son; this day have I begotten thee.” Inheritance includes the nations to the ends of the earth; rule includes a rod of iron and shattered pottery—images of irresistible authority. MacArthur-style notes stress the Messiah’s divine sonship and universal dominion."],
      ["10-12", "A pastoral warning to rulers: be wise, serve with fear, rejoice with trembling, “Kiss the Son”—submit and honor Him—lest wrath destroy. The psalm ends as Psalm 1 began: blessing on those who trust Him."],
    ],
    meaning:
      "Psalm 2 teaches that opposition to God’s King is real, organized, and vain. God is not threatened; He has already set His King. The Son’s inheritance is global; judgment is certain for rebels; refuge is open to all who trust Him. The psalm holds together God’s sovereignty, Christ’s kingship, and the call to repentant faith.",
    application:
      "Cultural and political hostility to Christ can feel overwhelming; this psalm renames it “vain.” Do not panic-match the rage of the age—rest in the King already set on Zion. Personally, “kiss the Son” means glad submission, not grudging religion: serve with fear and joy. Where you lead (home, work, influence), ask whether you are casting off Christ’s cords or welcoming His wise rule.",
    questions: [
      "Where do you see the “rage” of verse 1 in your world—and how does God’s laughter (v. 4) reframe your fear or anger?",
      "What would it look like this week to “kiss the Son” (v. 12) in a concrete area of resistance or autonomy?",
      "How does trusting the Anointed King change how you pray for leaders and nations?",
    ],
  },
  3: {
    title: "A Morning Shield",
    subtitle: "Lord, how are they increased that trouble me!",
    context:
      "Superscription (in the Hebrew Bible tradition): a psalm of David when he fled from Absalom. Psalm 3 is a personal lament that becomes confidence—often called a morning psalm because of verse 5 (sleep and waking). Henry notes the psalmist’s crisis is multiplied enemies and taunts that God will not help; faith answers with God as shield and sustainer. It follows the royal confidence of Psalm 2 with a king under siege.",
    verse_groups: [
      ["1-2", "Complaint: enemies increase; many rise up; mockers say there is no help in God. The pain is social and spiritual—isolation plus blasphemous taunt. Selah invites a pause under the weight of the crisis."],
      ["3-4", "Turning point: “But thou, O Lord, art a shield for me; my glory, and the lifter up of mine head.” Prayer is vocal and answered from God’s holy hill. Protection, dignity, and restoration of courage meet in one confession."],
      ["5-6", "Evidence of trust: he sleeps and wakes because the Lord sustains him. Fear of “ten thousands” is refused—not by denial of danger, but by confidence in God’s sustaining presence."],
      ["7-8", "Petition and praise: arise, save; God has already struck the ungodly’s power (“broken the teeth”). Salvation belongs to the Lord; blessing rests on His people. Personal deliverance expands to corporate hope."],
    ],
    meaning:
      "When opposition multiplies and voices deny God’s help, faith looks away from the count of enemies to the character of God—shield, glory, head-lifter, sustainer. Sleep becomes a theological act. Salvation is the Lord’s gift, not self-rescue.",
    application:
      "Anxiety often multiplies at night and in isolation. Practice Psalm 3’s pattern: name the trouble honestly, then preach God as shield to your own soul. Ask where mockery (“God won’t help”) has entered your thinking. Entrust sleep and waking to the Sustainer; refuse to let enemy-counts set your fear level.",
    questions: [
      "What “increased” troubles or voices currently say there is “no help… in God” for you?",
      "How have you experienced God as shield, glory, or lifter of your head—or where do you need that now?",
      "What would trusting the Lord with your sleep and waking look like this week?",
    ],
  },
  4: {
    title: "Peaceful Sleep",
    subtitle: "I will both lay me down in peace, and sleep",
    context:
      "An evening psalm of David (paired in use with morning Psalm 3). It addresses God, then opponents who shame what is honorable and chase vanity and lies, then returns to trust that yields peace deeper than prosperity. Henry highlights the contrast between many who ask “Who will shew us any good?” and the one who seeks God’s face.",
    verse_groups: [
      ["1", "Opening plea to the “God of my righteousness,” recalling past enlargement in distress. Mercy and hearing are requested on the basis of God’s proven faithfulness."],
      ["2-3", "Rebuke to “sons of men”: how long will they shame glory, love vanity, seek lies? Yet the Lord has set apart the godly for Himself and will hear. Identity under attack is answered by God’s claim on His own."],
      ["4-5", "Counsel: stand in awe, sin not; commune with your heart on your bed and be still; offer right sacrifices; trust the Lord. Inner stillness and righteous worship replace restless scheming."],
      ["6-8", "Many chase a vague “good”; the psalmist seeks the light of God’s countenance. Gladness exceeds harvest joy. Result: lying down in peace and safety—the Lord alone makes him dwell secure."],
    ],
    meaning:
      "True good is not first more corn and wine but God’s favorable presence. Those set apart by the Lord can be still, trust, and sleep—even when shamed by others—because safety is God’s gift.",
    application:
      "Evening is when vanity and anxiety often win. Before sleep, practice verse 4: quiet heart-communion, not endless scrolling. Measure “good” by God’s face more than by metrics of success. Where shame or false narratives press you, remember you are set apart for God, not defined by mockers.",
    questions: [
      "What “vanity” or false “good” most competes with seeking God’s face right now?",
      "How can you practice “be still” on your bed this week without numbing out?",
      "Where do you need the peace of verse 8 more than an increase of “corn and wine”?",
    ],
  },
  5: {
    title: "Morning Prayer",
    subtitle: "In the morning will I direct my prayer unto thee",
    context:
      "A morning prayer of David for guidance amid deceitful enemies. It contrasts God’s holiness (no pleasure in wickedness) with the psalmist’s approach by mercy into God’s house. Henry notes ordered morning prayer and the moral clarity that God opposes the bloody and deceitful while shielding the righteous.",
    verse_groups: [
      ["1-3", "Urgent, ordered prayer: give ear, consider, hearken. God is King and God. Morning prayer is directed (“I will direct… and will look up”)—expectant watching after speaking."],
      ["4-6", "Theology of holiness: God takes no pleasure in wickedness; evil cannot dwell with Him; He hates workers of iniquity and abhors the bloody and deceitful. Character shapes hope for justice."],
      ["7-8", "The worshiper enters by the multitude of mercy, in fear toward the holy temple, and asks for a straight path because of enemies. Access is mercy; guidance is needed in a hostile setting."],
      ["9-12", "Enemies’ speech is faithless, flattering, deadly (“open sepulchre”). Imprecation asks God to let their counsel fail. Trusting people rejoice under God’s defense; the righteous are compassed with favor as a shield."],
    ],
    meaning:
      "Prayer rests on who God is: holy King who hears, rejects evil, and receives the merciful approach of the righteous. Morning order and moral clarity go together; joy belongs to those who take refuge in Him.",
    application:
      "Begin days by directing prayer and looking up, not only checking threats. Let God’s holiness correct any casualness about deceit or flattery in your own speech. When opposed by unreliable words, ask for a straight path and for joy rooted in God’s shield, not in winning arguments.",
    questions: [
      "What would “direct my prayer… and look up” change about your morning routine?",
      "Where might flattery or deceit be shaping your relationships—and how does verse 9 warn you?",
      "How have you known God’s favor as a “shield,” or where do you need that protection?",
    ],
  },
  6: {
    title: "A Cry for Mercy",
    subtitle: "Have mercy upon me, O Lord; for I am weak",
    context:
      "The first of the traditional penitential psalms. David pleads under God’s discipline and human hostility—body and soul exhausted with tears. Henry traces the movement from fear of wrath, through weak pleading, to confident assurance that the Lord has heard. Sorrow is real; so is answered prayer.",
    verse_groups: [
      ["1-3", "Plea not to be rebuked in anger or chastened in hot displeasure. Weakness is total—bones and soul vexed. The cry “how long?” is honest faith, not unbelief."],
      ["4-5", "Appeal to covenant mercy: return, deliver, save. Argument from worship: the dead cannot remember or thank God as the living do—so spare for His praise’s sake."],
      ["6-7", "Depth of grief: nights of tears, eyes wasted by sorrow and enemies. The psalm legitimizes exhausted lament without cosplay toughness."],
      ["8-10", "Turning: workers of iniquity are told to depart—the Lord has heard weeping and will receive prayer. Enemies will be ashamed and turned back. Assurance arrives before circumstances fully change."],
    ],
    meaning:
      "God’s people may feel both divine discipline and human pressure until strength fails. Mercy, not merit, is the plea. God hears tears; confidence can return while eyes are still wet.",
    application:
      "If you are weak, this psalm gives you words—do not wait until you feel strong to pray. Distinguish condemnation-panic from Fatherly discipline; ask for mercy. When grief floods the night, remember verse 8–9: the Lord has heard. Let assurance push back both despair and the voices of those who rejoice in your pain.",
    questions: [
      "Where do you need to pray “how long?” honestly before God this week?",
      "How does appealing to God’s mercy (not your strength) reshape a current struggle?",
      "What would change if you believed God has already heard your weeping?",
    ],
  },
  7: {
    title: "Refuge and Righteous Judgment",
    subtitle: "O Lord my God, in thee do I put my trust",
    context:
      "A shiggaion of David concerning Cush the Benjamite (superscription tradition)—a cry under false accusation. The psalmist takes refuge in God, invites scrutiny of his integrity in the matter, and trusts that evil digs its own pit. Henry emphasizes both the refuge of trust and the moral order in which violence returns on the violent.",
    verse_groups: [
      ["1-2", "Trust and plea for deliverance from persecutors pictured as a tearing lion. Without God, there is no rescuer."],
      ["3-5", "Oath of innocence regarding the charge: if he repaid evil for peace, let the enemy win. Integrity is offered to God’s judgment, not self-justifying spin."],
      ["6-9", "Call for God to arise in judgment for the people’s sake. He asks to be judged according to righteousness and integrity in this cause, while longing for wickedness to end and the just to be established—God tries hearts and minds."],
      ["10-13", "Defense is of God, who saves the upright. God is a righteous judge, angry with the wicked every day; if they will not turn, sword and bow are ready. Justice is patient yet real."],
      ["14-17", "The wicked conceives mischief and falsehood, digs a pit, and falls into it; violence returns on his own head. The psalm ends in praise of the Lord’s righteousness."],
    ],
    meaning:
      "Under slander, the safe place is God—not revenge. Integrity can be laid before the Judge who tests motives. Evil is self-destructive under God’s government; praise is the fitting end of vindication hope.",
    application:
      "When misrepresented, refuse the lion-fight of self-vindication as first move—put trust in God and keep clean hands. Examine yourself honestly (vv. 3–5) before demanding judgment on others. Trust that pits dug for others often become traps for diggers; leave vengeance to the righteous Judge.",
    questions: [
      "Where are you tempted to self-defend more than to take refuge in God?",
      "Is there a charge or conflict where you need verse 3–5 honesty before the Lord?",
      "How does believing God “trieth the hearts” free you from managing others’ verdicts?",
    ],
  },
  8: {
    title: "Majesty and Human Dignity",
    subtitle: "What is man, that thou art mindful of him?",
    context:
      "A creation-hymn of David. God’s name is excellent in all the earth; His glory is above the heavens; yet He crowns frail humanity with dominion. Henry marvels at the condescension of the Creator. The New Testament applies the psalm to Christ as the true Son of Man (Heb 2:6–9; cf. Matt 21:16 on v. 2).",
    verse_groups: [
      ["1-2", "Opening and closing refrain: excellent name in all the earth; glory above the heavens. Strength ordained from children’s mouths silences the enemy—God uses the weak to still the avenger."],
      ["3-4", "Contemplation of moon and stars leads to wonder: what is man that God is mindful of him, or the son of man that God visits him? Scale produces humility, not despair."],
      ["5-8", "Answer: made a little lower than the angels (or heavenly beings), crowned with glory and honor, given dominion over works of God’s hands—flocks, beasts, birds, fish. Royal stewardship is gift, not self-made status."],
      ["9", "The refrain returns: excellence of the Lord’s name in all the earth. Worship brackets anthropology."],
    ],
    meaning:
      "God’s majesty does not erase human worth; it grounds it. We are small before the cosmos yet honored as stewards under God. Ultimate fulfillment is in Christ, the true Man who recovers dominion through humility and exaltation.",
    application:
      "Practice Psalm 8 wonder: look up and ask verse 4 without cynicism. Treat people—including yourself—as crowned image-bearers, not products. Exercise dominion as care (creation, work, relationships), not exploitation. Let children’s simple praise remind you that God silences evil through unlikely strength.",
    questions: [
      "When you last considered the heavens, did it lead you toward worship or toward feeling worthless—and how does verse 5 correct that?",
      "Where is God calling you to steward “dominion” as care rather than control?",
      "How does seeing Christ as the true fulfillment of Psalm 8 deepen your trust or humility?",
    ],
  },
  9: {
    title: "God the Righteous Judge",
    subtitle: "The Lord also will be a refuge for the oppressed",
    context:
      "A thanksgiving and judgment psalm of David (often linked with Psalm 10 in Hebrew tradition as a partial acrostic). It celebrates God’s just rule, refuge for the oppressed, and the self-defeat of the wicked. Henry stresses wholehearted praise and God’s unfailing memory of the humble’s cry.",
    verse_groups: [
      ["1-6", "Wholehearted praise for marvelous works. Enemies fall at God’s presence; He maintains the psalmist’s cause, rebukes nations, blots out the wicked’s name. Human memorials perish; God’s justice endures."],
      ["7-10", "The Lord sits enthroned forever for judgment in righteousness. He is a refuge for the oppressed in trouble. Those who know His name trust Him; He does not forsake seekers."],
      ["11-14", "Public praise in Zion and among the peoples. God remembers bloodshed and the cry of the humble. Personal plea: mercy from haters, lifted from death’s gates, to recount praise in Zion."],
      ["15-20", "The nations sink in their own pit and net. The Lord is known by His judgments; the wicked are snared by their hands. The wicked and forgetful nations face ruin; the needy will not be forever forgotten. Prayer: arise, let nations know they are but men."],
    ],
    meaning:
      "God’s throne means righteous judgment and real refuge. Oppressors fall into their own traps; the poor’s hope is not naive. Knowing God’s name produces trust; forgetting God is deadly for nations and persons.",
    application:
      "Praise with your “whole heart” for specific works of justice and mercy you have seen. When oppression seems permanent, hold verse 9–10 and 18. Refuse the pride of nations and institutions that forget they are “but men.” Seek God by name—not as a slogan, but as the refuge who does not forsake.",
    questions: [
      "What marvelous works can you “shew forth” in praise this week (v. 1)?",
      "Who around you needs the refuge of verse 9—and how might you reflect that refuge practically?",
      "Where do you see the pride of “nations… but men,” and how should that shape your prayers?",
    ],
  },
  10: {
    title: "When God Seems Far",
    subtitle: "Why standest thou afar off, O Lord?",
    context:
      "A lament over the proud wicked who prey on the poor and assume God does not see. Often read with Psalm 9. Henry notes the psalm’s honest protest (“Why hidest thou?”) and its movement to confidence that God has seen, hears the humble, and will judge. It gives language for times when evil seems unchecked.",
    verse_groups: [
      ["1-4", "Complaint: God seems distant in trouble. The wicked proudly persecute the poor, boast desires, bless greed, and refuse to seek God—“God is not in all his thoughts.” Practical atheism fuels oppression."],
      ["5-11", "Portrait of the oppressor: secure, sneering at enemies, sure he will never be moved; mouth full of cursing and deceit; ambush of the innocent like a lion; heart says God has forgotten and will never see."],
      ["12-15", "Petition: arise, lift Your hand, forget not the humble. The wicked contemn God, saying He will not require account. Faith answers: You have seen; You will requite; the poor commit themselves to You, helper of the fatherless. Break the arm of the wicked."],
      ["16-18", "Confession: the Lord is King forever. He has heard the humble’s desire, prepares their heart, hears, and judges for the fatherless and oppressed so earthly man may no more oppress."],
    ],
    meaning:
      "Felt divine absence is part of faithful prayer, not its opposite. God sees mischief the wicked deny; He is King; He hears the humble and defends the fatherless. Oppression’s swagger is temporary under His reign.",
    application:
      "When God feels far, use verse 1 rather than silent despair. Name modern “lurking places” of exploitation and pray verse 12–15. Commit the vulnerable (and yourself when vulnerable) to the helper of the fatherless. Let the King’s forever-reign correct both cynicism and passivity.",
    questions: [
      "Where does it currently feel as if God is “afar off”—and can you bring that question to Him as the psalmist does?",
      "How does the portrait of the wicked (pride, greed, “God won’t see”) confront your culture or your own heart?",
      "What would it mean to “commit” a burden or a vulnerable person to the Lord this week (v. 14)?",
    ],
  },
};

function cleanText(t) {
  return String(t || "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

async function fetchChapter(n) {
  const url = `https://bible-api.com/psalms%20${n}?translation=kjv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed for Psalm ${n}: ${res.status}`);
  const data = await res.json();
  return (data.verses || []).map((v) => ({
    n: v.verse,
    text: cleanText(v.text),
  }));
}

function buildJson(chapter, verses) {
  const study = STUDIES[chapter];
  if (!study) throw new Error(`No study content for Psalm ${chapter}`);
  return {
    book: "Psalms",
    chapter,
    title: study.title,
    subtitle: study.subtitle,
    translation: "KJV",
    verses,
    context: study.context,
    verse_commentary: study.verse_groups.map(([n, note]) => ({ n, note })),
    meaning: study.meaning,
    application: study.application,
    questions: study.questions,
    sources: SOURCES,
  };
}

async function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const chapters = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const gen = path.join(BIBLE_ROOT, "scripts", "generate-worksheet.mjs");

  for (const n of chapters) {
    process.stdout.write(`Psalm ${n}: fetch… `);
    const verses = await fetchChapter(n);
    if (!verses.length) throw new Error(`No verses for Psalm ${n}`);
    const json = buildJson(n, verses);
    const nn = String(n).padStart(2, "0");
    const outJson = path.join(DATA_DIR, `Psalms-${nn}.json`);
    fs.writeFileSync(outJson, JSON.stringify(json, null, 2) + "\n");
    process.stdout.write(`json(${verses.length}v)… `);
    const r = spawnSync(process.execPath, [gen, outJson], {
      cwd: BIBLE_ROOT,
      encoding: "utf8",
    });
    if (r.status !== 0) {
      console.error(r.stdout || "", r.stderr || "");
      throw new Error(`Generator failed for Psalm ${n}`);
    }
    console.log("md+pdf ok");
  }
  console.log("Done: Psalms 2–10");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
