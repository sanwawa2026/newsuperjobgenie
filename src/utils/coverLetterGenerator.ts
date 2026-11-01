import { ExtractedJobData, MatchAnalysisResult, CandidateProfile } from '../types';

/**
 * 军师核心算法：高保真动态求职信同步引擎
 * 确保 Cover Letter 100% 与插件实际检测到的公司、职位、技能和候选人实时对齐
 */
export function generateSynchronizedCoverLetters(
  job: ExtractedJobData,
  match: MatchAnalysisResult,
  candidate: CandidateProfile
): { tier3Free: string; tier4Pro: string } {
  const company = job.company?.trim() || match.company?.trim() || 'Hiring Team';
  const title = job.title?.trim() || match.jobTitle?.trim() || 'Target Role';
  const location = job.location?.trim() || match.location?.trim() || 'On-site / Hybrid';
  const candidateName = candidate.name?.trim() || 'Senior Professional';
  const candidateTitle = candidate.title?.trim() || 'Specialist & Engineering Lead';
  const yoe = candidate.yearsOfExperience || 10;

  // 提取技能列表
  const verifiedNames = (match.verifiedSkills || []).map(s => s.name);
  const candidateSkills = candidate.skills || [];
  const primarySkills = verifiedNames.length > 0 
    ? verifiedNames 
    : (candidateSkills.length > 0 ? candidateSkills : ['Quantitative Analysis', 'Strategic Execution', 'Process Optimization']);

  const topSkillsList = primarySkills.slice(0, 4);
  const skillsDisplay = topSkillsList.join(', ');

  // 1. 3-Tier Standard Letter (Professional Baseline)
  const tier3Free = `Dear ${company} Hiring Team,

I am writing to express my strong enthusiasm for the ${title} position at ${company}. With over ${yoe} years of professional experience across ${skillsDisplay}, I have dedicated my career to driving rigorous, data-driven outcomes and scalable execution in high-standard environments.

Throughout my career, I have consistently aligned technical precision with strategic business objectives. Whether evaluating complex quantitative models, optimizing workflows, or conducting thorough due diligence and system verification, my focus is always on delivering measurable performance and eliminating operational blind spots. What excites me most about ${company} is your team's relentless commitment to quality and execution standards.

Key alignments I bring to this ${title} role include:
• Core Competency: Extensive hands-on background in ${primarySkills[0] || 'strategic problem solving'}, driving high-accuracy deliverables under tight deadlines.
• Analytical Rigor: Proven track record in ${primarySkills[1] || 'quantitative analysis'} and structured evaluation, ensuring zero-defect deliverables.
• Collaborative Execution: Strong history of cross-functional alignment and clear stakeholder communication to streamline critical operations.

I look forward to discussing how my background in ${skillsDisplay} can contribute immediate value to ${company}'s ongoing initiatives.

Sincerely,
${candidateName}
${candidateTitle}`;

  // 2. 4-Tier FAANG Pro Letter (Executive Strategic Pitch)
  const tier4Pro = `EXECUTIVE APPLICATION BRIEF: ${title.toUpperCase()}
Target Organization: ${company.toUpperCase()}
Applicant: ${candidateName} (${candidateTitle} • ${yoe}+ Years Experience)
Target Role: ${title} | Location: ${location}

1. EXECUTIVE VALUE PROPOSITION:
Modern high-performance teams at organizations like ${company} require professionals who combine deep domain rigor with rapid, fault-tolerant execution. As a ${candidateTitle} with ${yoe}+ years of battle-tested experience across ${skillsDisplay}, I bridge quantitative discipline, strategic analysis, and dependable day-one execution.

2. DIRECT COMPETENCY ALIGNMENT MATRIX:
• Domain Mastery & Execution: Deep expertise in ${primarySkills[0] || 'core methodologies'}, consistently delivering high-accuracy analyses and resilient workflow frameworks.
• Quantitative & Analytical Precision: Extensive experience utilizing ${primarySkills[1] || 'data-driven frameworks'} to identify non-obvious optimizations, reduce operational variance, and improve overall throughput.
• Risk Mitigation & Governance: Proven methodology enforcing rigorous boundary checks and quality standards, eliminating costly oversights in high-stakes environments.
• Stakeholder Leadership: Track record converting ambiguous strategic requirements into concrete, measurable deliverables and executive documentation.

3. STRATEGIC FIT FOR ${company.toUpperCase()}:
Having analyzed ${company}'s operational scope and market positioning for the ${title} opportunity, I am prepared to integrate seamlessly with your existing infrastructure, upholding your organization's highest standards of craftsmanship and analytical integrity.

4. INTERVIEW READINESS & AVAILABILITY:
I welcome an introductory discussion or technical case study review to walk through concrete work samples, analytical frameworks, and operational achievements.

Respectfully submitted,
${candidateName}
${candidateTitle}`;

  return {
    tier3Free,
    tier4Pro,
  };
}
