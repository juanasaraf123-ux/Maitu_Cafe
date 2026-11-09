/**
 * Punto único de registro de GSAP y sus plugins.
 * Importar siempre gsap/ScrollTrigger desde aquí para no registrar dos veces.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 0.9 })

export { gsap, ScrollTrigger, useGSAP }
