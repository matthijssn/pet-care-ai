import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svg-pet-illustration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.viewBox]="viewBox"
      xmlns="http://www.w3.org/2000/svg"
      class="pet-illustration"
    >
      <!-- Dog Illustration -->
      <g *ngIf="petType === 'dog'">
        <!-- Body -->
        <ellipse cx="100" cy="120" rx="45" ry="50" fill="#D4A574" stroke="#8B6F47" stroke-width="2"/>
        
        <!-- Head -->
        <circle cx="100" cy="70" r="35" fill="#D4A574" stroke="#8B6F47" stroke-width="2"/>
        
        <!-- Left Ear -->
        <ellipse cx="75" cy="45" rx="15" ry="25" fill="#8B6F47" stroke="#5D4A31" stroke-width="1.5"/>
        
        <!-- Right Ear -->
        <ellipse cx="125" cy="45" rx="15" ry="25" fill="#8B6F47" stroke="#5D4A31" stroke-width="1.5"/>
        
        <!-- Snout -->
        <ellipse cx="100" cy="80" rx="20" ry="15" fill="#E8C9A0" stroke="#8B6F47" stroke-width="1.5"/>
        
        <!-- Left Eye -->
        <circle cx="88" cy="65" r="5" fill="#2C2C2C"/>
        <circle cx="89" cy="64" r="1.5" fill="white"/>
        
        <!-- Right Eye -->
        <circle cx="112" cy="65" r="5" fill="#2C2C2C"/>
        <circle cx="113" cy="64" r="1.5" fill="white"/>
        
        <!-- Nose -->
        <circle cx="100" cy="85" r="4" fill="#2C2C2C"/>
        
        <!-- Mouth -->
        <path d="M 100 85 Q 98 92 95 90" stroke="#2C2C2C" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M 100 85 Q 102 92 105 90" stroke="#2C2C2C" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        
        <!-- Front Left Leg -->
        <rect x="80" y="165" width="12" height="45" rx="6" fill="#D4A574" stroke="#8B6F47" stroke-width="1.5"/>
        
        <!-- Front Right Leg -->
        <rect x="108" y="165" width="12" height="45" rx="6" fill="#D4A574" stroke="#8B6F47" stroke-width="1.5"/>
        
        <!-- Back Left Leg -->
        <rect x="70" y="160" width="10" height="50" rx="5" fill="#C19560" stroke="#8B6F47" stroke-width="1.5"/>
        
        <!-- Back Right Leg -->
        <rect x="120" y="160" width="10" height="50" rx="5" fill="#C19560" stroke="#8B6F47" stroke-width="1.5"/>
        
        <!-- Tail -->
        <path d="M 140 120 Q 155 110 160 85" stroke="#D4A574" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Heart indicator -->
        <text x="50" y="35" font-size="20">❤️</text>
      </g>

      <!-- Cat Illustration -->
      <g *ngIf="petType === 'cat'">
        <!-- Body -->
        <ellipse cx="100" cy="130" rx="40" ry="45" fill="#FFB366" stroke="#FF8C42" stroke-width="2"/>
        
        <!-- Head -->
        <circle cx="100" cy="75" r="32" fill="#FFB366" stroke="#FF8C42" stroke-width="2"/>
        
        <!-- Left Ear -->
        <polygon points="75,45 65,15 80,35" fill="#FFB366" stroke="#FF8C42" stroke-width="1.5"/>
        
        <!-- Right Ear -->
        <polygon points="125,45 135,15 120,35" fill="#FFB366" stroke="#FF8C42" stroke-width="1.5"/>
        
        <!-- Left Ear Inner -->
        <polygon points="74,42 70,25 76,35" fill="#FFD9B3"/>
        
        <!-- Right Ear Inner -->
        <polygon points="126,42 130,25 124,35" fill="#FFD9B3"/>
        
        <!-- Face -->
        <circle cx="100" cy="80" r="28" fill="#FFD9B3" stroke="none"/>
        
        <!-- Left Eye -->
        <ellipse cx="88" cy="70" rx="5" ry="8" fill="#2C2C2C"/>
        <ellipse cx="88" cy="72" rx="2" ry="3" fill="#90EE90"/>
        
        <!-- Right Eye -->
        <ellipse cx="112" cy="70" rx="5" ry="8" fill="#2C2C2C"/>
        <ellipse cx="112" cy="72" rx="2" ry="3" fill="#90EE90"/>
        
        <!-- Nose -->
        <polygon points="100,85 97,92 103,92" fill="#FF69B4"/>
        
        <!-- Mouth -->
        <path d="M 100 92 Q 95 98 92 96" stroke="#2C2C2C" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M 100 92 Q 105 98 108 96" stroke="#2C2C2C" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        
        <!-- Whiskers -->
        <line x1="70" y1="85" x2="50" y2="82" stroke="#2C2C2C" stroke-width="1"/>
        <line x1="70" y1="92" x2="48" y2="95" stroke="#2C2C2C" stroke-width="1"/>
        <line x1="130" y1="85" x2="150" y2="82" stroke="#2C2C2C" stroke-width="1"/>
        <line x1="130" y1="92" x2="152" y2="95" stroke="#2C2C2C" stroke-width="1"/>
        
        <!-- Front Left Leg -->
        <rect x="80" y="170" width="12" height="45" rx="6" fill="#FFB366" stroke="#FF8C42" stroke-width="1.5"/>
        
        <!-- Front Right Leg -->
        <rect x="108" y="170" width="12" height="45" rx="6" fill="#FFB366" stroke="#FF8C42" stroke-width="1.5"/>
        
        <!-- Back Left Leg -->
        <rect x="70" y="165" width="10" height="50" rx="5" fill="#FFA500" stroke="#FF8C42" stroke-width="1.5"/>
        
        <!-- Back Right Leg -->
        <rect x="120" y="165" width="10" height="50" rx="5" fill="#FFA500" stroke="#FF8C42" stroke-width="1.5"/>
        
        <!-- Tail (curved) -->
        <path d="M 135 130 Q 155 120 160 80 Q 162 60 150 50" stroke="#FFB366" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- Bird Illustration -->
      <g *ngIf="petType === 'bird'">
        <!-- Body -->
        <ellipse cx="90" cy="120" rx="30" ry="35" fill="#4DD0E1" stroke="#00ACC1" stroke-width="2"/>
        
        <!-- Head -->
        <circle cx="90" cy="70" r="28" fill="#4DD0E1" stroke="#00ACC1" stroke-width="2"/>
        
        <!-- Crest -->
        <path d="M 85 45 Q 88 30 92 42" fill="#FFD700" stroke="#FFA500" stroke-width="1.5"/>
        <path d="M 92 42 Q 96 28 98 45" fill="#FFD700" stroke="#FFA500" stroke-width="1.5"/>
        
        <!-- Left Wing -->
        <ellipse cx="70" cy="115" rx="25" ry="35" fill="#00BCD4" stroke="#00ACC1" stroke-width="1.5" transform="rotate(-30 70 115)"/>
        
        <!-- Right Wing -->
        <ellipse cx="110" cy="115" rx="25" ry="35" fill="#00BCD4" stroke="#00ACC1" stroke-width="1.5" transform="rotate(30 110 115)"/>
        
        <!-- Left Eye -->
        <circle cx="82" cy="65" r="4" fill="#2C2C2C"/>
        <circle cx="83" cy="64" r="1.2" fill="white"/>
        
        <!-- Right Eye -->
        <circle cx="98" cy="65" r="4" fill="#2C2C2C"/>
        <circle cx="99" cy="64" r="1.2" fill="white"/>
        
        <!-- Beak -->
        <polygon points="90,75 102,75 100,80" fill="#FFA500" stroke="#FF8C00" stroke-width="1"/>
        
        <!-- Left Leg -->
        <line x1="85" y1="150" x2="85" y2="175" stroke="#FF6F00" stroke-width="3" stroke-linecap="round"/>
        
        <!-- Right Leg -->
        <line x1="95" y1="150" x2="95" y2="175" stroke="#FF6F00" stroke-width="3" stroke-linecap="round"/>
        
        <!-- Left Foot -->
        <g>
          <line x1="82" y1="175" x2="82" y2="180" stroke="#FF6F00" stroke-width="2" stroke-linecap="round"/>
          <line x1="85" y1="175" x2="85" y2="180" stroke="#FF6F00" stroke-width="2" stroke-linecap="round"/>
          <line x1="88" y1="175" x2="88" y2="180" stroke="#FF6F00" stroke-width="2" stroke-linecap="round"/>
        </g>
        
        <!-- Right Foot -->
        <g>
          <line x1="92" y1="175" x2="92" y2="180" stroke="#FF6F00" stroke-width="2" stroke-linecap="round"/>
          <line x1="95" y1="175" x2="95" y2="180" stroke="#FF6F00" stroke-width="2" stroke-linecap="round"/>
          <line x1="98" y1="175" x2="98" y2="180" stroke="#FF6F00" stroke-width="2" stroke-linecap="round"/>
        </g>
      </g>

      <!-- Rabbit Illustration -->
      <g *ngIf="petType === 'rabbit'">
        <!-- Body -->
        <ellipse cx="100" cy="130" rx="38" ry="48" fill="#FFF" stroke="#D3D3D3" stroke-width="2"/>
        
        <!-- Head -->
        <circle cx="100" cy="70" r="30" fill="#FFF" stroke="#D3D3D3" stroke-width="2"/>
        
        <!-- Left Ear -->
        <ellipse cx="78" cy="30" rx="12" ry="40" fill="#FFF" stroke="#D3D3D3" stroke-width="2"/>
        <ellipse cx="78" cy="30" rx="6" ry="32" fill="#FFB6C1"/>
        
        <!-- Right Ear -->
        <ellipse cx="122" cy="30" rx="12" ry="40" fill="#FFF" stroke="#D3D3D3" stroke-width="2"/>
        <ellipse cx="122" cy="30" rx="6" ry="32" fill="#FFB6C1"/>
        
        <!-- Left Eye -->
        <circle cx="88" cy="65" r="5" fill="#2C2C2C"/>
        <circle cx="89" cy="64" r="1.5" fill="white"/>
        
        <!-- Right Eye -->
        <circle cx="112" cy="65" r="5" fill="#2C2C2C"/>
        <circle cx="113" cy="64" r="1.5" fill="white"/>
        
        <!-- Nose -->
        <circle cx="100" cy="80" r="3" fill="#FFB6C1"/>
        
        <!-- Mouth -->
        <path d="M 100 80 Q 98 88 95 86" stroke="#2C2C2C" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M 100 80 Q 102 88 105 86" stroke="#2C2C2C" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        
        <!-- Front Left Leg -->
        <ellipse cx="82" cy="170" rx="10" ry="28" fill="#FFF" stroke="#D3D3D3" stroke-width="1.5"/>
        
        <!-- Front Right Leg -->
        <ellipse cx="118" cy="170" rx="10" ry="28" fill="#FFF" stroke="#D3D3D3" stroke-width="1.5"/>
        
        <!-- Back Left Leg -->
        <ellipse cx="72" cy="160" rx="9" ry="35" fill="#FFF" stroke="#D3D3D3" stroke-width="1.5"/>
        
        <!-- Back Right Leg -->
        <ellipse cx="128" cy="160" rx="9" ry="35" fill="#FFF" stroke="#D3D3D3" stroke-width="1.5"/>
        
        <!-- Tail -->
        <circle cx="100" cy="180" r="12" fill="#FFF" stroke="#D3D3D3" stroke-width="2"/>
      </g>

      <!-- Hamster Illustration -->
      <g *ngIf="petType === 'hamster'">
        <!-- Body -->
        <circle cx="100" cy="110" r="45" fill="#CD853F" stroke="#8B4513" stroke-width="2"/>
        
        <!-- Head -->
        <circle cx="100" cy="70" r="35" fill="#CD853F" stroke="#8B4513" stroke-width="2"/>
        
        <!-- Cheek Pouches -->
        <circle cx="70" cy="75" r="15" fill="#D2691E" stroke="#8B4513" stroke-width="1.5" opacity="0.7"/>
        <circle cx="130" cy="75" r="15" fill="#D2691E" stroke="#8B4513" stroke-width="1.5" opacity="0.7"/>
        
        <!-- Left Eye -->
        <circle cx="88" cy="60" r="6" fill="#2C2C2C"/>
        <circle cx="89" cy="59" r="2" fill="white"/>
        
        <!-- Right Eye -->
        <circle cx="112" cy="60" r="6" fill="#2C2C2C"/>
        <circle cx="113" cy="59" r="2" fill="white"/>
        
        <!-- Nose -->
        <circle cx="100" cy="75" r="3" fill="#8B4513"/>
        
        <!-- Mouth -->
        <path d="M 100 75 Q 98 82 96 80" stroke="#8B4513" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M 100 75 Q 102 82 104 80" stroke="#8B4513" stroke-width="1" fill="none" stroke-linecap="round"/>
        
        <!-- Front Left Leg -->
        <ellipse cx="80" cy="145" rx="8" ry="22" fill="#8B4513"/>
        
        <!-- Front Right Leg -->
        <ellipse cx="120" cy="145" rx="8" ry="22" fill="#8B4513"/>
        
        <!-- Back Left Leg -->
        <ellipse cx="75" cy="140" rx="7" ry="20" fill="#654321"/>
        
        <!-- Back Right Leg -->
        <ellipse cx="125" cy="140" rx="7" ry="20" fill="#654321"/>
        
        <!-- Tail (curled) -->
        <path d="M 135 110 Q 150 100 152 85" stroke="#8B4513" stroke-width="8" fill="none" stroke-linecap="round"/>
      </g>

      <!-- Default/Other -->
      <g *ngIf="!['dog', 'cat', 'bird', 'rabbit', 'hamster'].includes(petType)">
        <!-- Paw prints -->
        <circle cx="60" cy="80" r="12" fill="#E0E0E0" opacity="0.6"/>
        <circle cx="100" cy="60" r="12" fill="#E0E0E0" opacity="0.6"/>
        <circle cx="140" cy="85" r="12" fill="#E0E0E0" opacity="0.6"/>
        <circle cx="90" cy="140" r="12" fill="#E0E0E0" opacity="0.6"/>
        <circle cx="110" cy="145" r="12" fill="#E0E0E0" opacity="0.6"/>
        
        <!-- Heart -->
        <text x="95" y="110" font-size="40">🐾</text>
      </g>
    </svg>
  `,
  styles: [
    `
      .pet-illustration {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
    `
  ]
})
export class PetIllustrationComponent implements OnInit {
  @Input() petType: string = 'dog';
  viewBox: string = '0 0 200 220';

  ngOnInit() {
    // Ensure petType is lowercase for comparison
    this.petType = this.petType?.toLowerCase() || 'dog';
  }
}
