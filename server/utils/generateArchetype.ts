function parseHeight(heightStr: string): number {
  const match = heightStr.match(/(\d+)'(\d+)"?/);
  if (!match) return 70;

  const feet = parseInt(match[1], 10);
  const inches = parseInt(match[2], 10);
  return feet * 12 + inches;
}

function getPosition(heightIn: number): "guard" | "wing" | "big" {
  if (heightIn <= 70) return "guard";
  if (heightIn <= 74) return "guard";
  if (heightIn <= 77) return "wing";
  return "big";
}

export function generateArchetype(
  defense: number,
  playmaking: number,
  finishing: number,
  shooting: number,
  heightStr: string
): string {
  const height = parseHeight(heightStr);
  const position = getPosition(height);

  const stats = [
    { key: "shooting", value: shooting },
    { key: "finishing", value: finishing },
    { key: "playmaking", value: playmaking },
    { key: "defense", value: defense },
  ].sort((a, b) => b.value - a.value);

  const primary = stats[0];
  const secondary = stats[1];

  const p = primary.key;
  const s = secondary.key;

  const isTwoWay = (p === "defense" || s === "defense") && defense >= 80;

  const gap = primary.value - secondary.value;

  function name(n: string) {
    return isTwoWay ? `2-Way ${n}` : n;
  }

  if (position === "big") {
    if (defense >= 92 && finishing >= 85) return "Paint Beast";
    if (defense >= 92 && shooting >= 80) return "Stretch 5";
    if (finishing >= 92 && playmaking >= 80) return "Interior Playmaker";
    if (finishing >= 92) return "Interior Finisher";
    if (defense >= 90) return "Rim Protector";
    if (shooting >= 90) return "Stretch Big";
    if (finishing >= 88 && shooting >= 82) return "Slashing 5";
  }

  if (position === "wing") {
    if (playmaking >= 90 && finishing >= 85) return name("Point Forward");
    if (shooting >= 92 && defense >= 82) return "3 & D Wing";
    if (finishing >= 92 && shooting >= 80) return name("Slashing Wing");
    if (defense >= 90 && finishing >= 80) return "Rugged Wing";
    if (playmaking >= 90 && shooting >= 85) return name("Shot Creator");
    if (finishing >= 88 && playmaking >= 80) return name("Slashing Playmaker");
  }

  if (position === "guard") {
    if (shooting >= 92 && playmaking >= 85)
      return name("Playmaking Shot Creator");
    if (shooting >= 92 && finishing >= 82) return name("Sharpshooting Slasher");
    if (playmaking >= 92 && finishing >= 85) return name("Slashing Playmaker");
    if (defense >= 90 && shooting >= 82) return "3 & D Guard";
    if (playmaking >= 90 && shooting >= 80) return name("Shot Creator");
    if (finishing >= 92) return name("Slasher");
  }

  if (p === "shooting" && shooting >= 92) {
    if (playmaking >= 80) return name("Playmaking Shot Creator");
    if (finishing >= 80) return name("Sharpshooting Slasher");
    if (defense >= 80) return "3 & D Wing";
    return name("3pt Specialist");
  }

  if (p === "finishing" && finishing >= 92) {
    if (playmaking >= 80) return name("Slashing Playmaker");
    if (defense >= 80) return "2-Way Finisher";
    if (shooting >= 80) return name("Mid-Range Slasher");
    return name("Slasher");
  }

  if (p === "playmaking" && playmaking >= 92) {
    if (shooting >= 85) return name("Playmaking Shot Creator");
    if (finishing >= 85) return name("Facilitating Finisher");
    return name("Playmaker");
  }

  if (p === "defense" && defense >= 92) {
    if (finishing >= 80) return "Rim Protector";
    if (shooting >= 80) return "3 & D Wing";
    if (playmaking >= 80) return "2-Way Playmaker";
    return "Perimeter Lockdown";
  }

  if (p === "shooting" && s === "finishing") return name("Inside-Out Scorer");
  if (p === "finishing" && s === "shooting") return name("Inside-Out Scorer");

  if (p === "shooting" && s === "playmaking") return name("Shot Creator");
  if (p === "playmaking" && s === "shooting")
    return name("Playmaking Shot Creator");

  if (p === "playmaking" && s === "defense")
    return isTwoWay ? "2-Way Playmaker" : "Ball Hawk";
  if (p === "defense" && s === "playmaking") return "2-Way Playmaker";

  if (p === "defense" && s === "shooting") return "3 & D Wing";
  if (p === "shooting" && s === "defense") return "3 & D Wing";

  if (p === "finishing" && s === "defense") return name("Rugged Wing");
  if (p === "defense" && s === "finishing") return name("Rugged Wing");

  if (p === "finishing" && s === "playmaking")
    return name("Slashing Playmaker");
  if (p === "playmaking" && s === "finishing")
    return name("Slashing Playmaker");

  const avg = (defense + playmaking + finishing + shooting) / 4;
  if (avg >= 75 && gap < 8) {
    if (isTwoWay) return "All Around 2-Way";
    return "Balanced Scorer";
  }

  return name(
    {
      shooting: "Shooter",
      finishing: "Slasher",
      playmaking: "Playmaker",
      defense: "Defender",
    }[p]!
  );
}
