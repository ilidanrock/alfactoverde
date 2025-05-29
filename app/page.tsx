"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Trash2,
  Award,
  Sparkles,
  TreePine,
} from "lucide-react"

interface FormData {
  transport: {
    carUsage: string
    carType: string
    publicTransport: string
    flights: string
  }
  home: {
    electricity: string
    heating: string
    houseSize: string
    people: string
  }
  food: {
    diet: string
    localFood: string
    foodWaste: string
  }
  consumption: {
    shopping: string
    electronics: string
    clothing: string
  }
  waste: {
    recycling: string
    composting: string
  }
}

const initialFormData: FormData = {
  transport: { carUsage: "", carType: "", publicTransport: "", flights: "" },
  home: { electricity: "", heating: "", houseSize: "", people: "" },
  food: { diet: "", localFood: "", foodWaste: "" },
  consumption: { shopping: "", electronics: "", clothing: "" },
  waste: { recycling: "", composting: "" },
}

export default function CarbonFootprintCalculator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [showResults, setShowResults] = useState(false)

  const steps = [
    {
      title: "Transporte",
      icon: Car,
      description: "Tu movilidad diaria",
      color: "from-[#2f86c8] to-[#a2c4e2]",
      bgColor: "bg-gradient-to-br from-[#a2c4e2]/20 to-[#2f86c8]/20",
      accentColor: "#2f86c8",
    },
    {
      title: "Hogar",
      icon: Home,
      description: "Consumo energético",
      color: "from-[#993c65] to-[#dad6d9]",
      bgColor: "bg-gradient-to-br from-[#993c65]/20 to-[#dad6d9]/20",
      accentColor: "#993c65",
    },
    {
      title: "Alimentación",
      icon: Utensils,
      description: "Hábitos alimentarios",
      color: "from-[#623272] to-[#3e4e9b]",
      bgColor: "bg-gradient-to-br from-[#623272]/20 to-[#3e4e9b]/20",
      accentColor: "#623272",
    },
    {
      title: "Consumo",
      icon: ShoppingBag,
      description: "Patrones de compra",
      color: "from-[#234097] to-[#9e9e9e]",
      bgColor: "bg-gradient-to-br from-[#234097]/20 to-[#9e9e9e]/20",
      accentColor: "#234097",
    },
    {
      title: "Residuos",
      icon: Trash2,
      description: "Reciclaje y gestión",
      color: "from-[#3c3c84] to-[#5d5d5d]",
      bgColor: "bg-gradient-to-br from-[#3c3c84]/20 to-[#5d5d5d]/20",
      accentColor: "#3c3c84",
    },
  ]

  const calculateCarbonFootprint = () => {
    let total = 0

    // Transporte
    const carUsage = Number.parseInt(formData.transport.carUsage) || 0
    const carMultiplier =
      formData.transport.carType === "electric" ? 0.5 : formData.transport.carType === "hybrid" ? 0.7 : 1
    total += carUsage * carMultiplier * 0.2

    // Vuelos
    const flights = Number.parseInt(formData.transport.flights) || 0
    total += flights * 0.5

    // Hogar
    const electricity = Number.parseInt(formData.home.electricity) || 0
    total += electricity * 0.0005

    const houseSize = formData.home.houseSize === "large" ? 1.5 : formData.home.houseSize === "medium" ? 1 : 0.7
    total += houseSize * 2

    // Alimentación
    const dietMultiplier = formData.food.diet === "meat" ? 2.5 : formData.food.diet === "vegetarian" ? 1.5 : 1
    total += dietMultiplier

    // Consumo
    const shoppingMultiplier =
      formData.consumption.shopping === "high" ? 2 : formData.consumption.shopping === "medium" ? 1.2 : 0.8
    total += shoppingMultiplier

    // Residuos
    const recyclingBonus =
      formData.waste.recycling === "always" ? -0.5 : formData.waste.recycling === "sometimes" ? -0.2 : 0
    total += recyclingBonus

    return Math.max(total, 0.5) // Mínimo 0.5 toneladas
  }

  const getFootprintLevel = (footprint: number) => {
    if (footprint < 3)
      return {
        level: "¡Excelente!",
        color: "text-[#2f86c8]",
        bg: "bg-gradient-to-r from-[#2f86c8] to-[#a2c4e2]",
        message: "Eres un verdadero guardián del planeta 🌟",
      }
    if (footprint < 6)
      return {
        level: "Muy Bueno",
        color: "text-[#623272]",
        bg: "bg-gradient-to-r from-[#623272] to-[#3e4e9b]",
        message: "Vas por buen camino hacia la sostenibilidad 🌱",
      }
    if (footprint < 10)
      return {
        level: "Puede Mejorar",
        color: "text-[#993c65]",
        bg: "bg-gradient-to-r from-[#993c65] to-[#234097]",
        message: "Pequeños cambios pueden hacer gran diferencia 🌿",
      }
    return {
      level: "Necesita Atención",
      color: "text-[#5d5d5d]",
      bg: "bg-gradient-to-r from-[#5d5d5d] to-[#9e9e9e]",
      message: "Es momento de actuar por nuestro planeta 🌍",
    }
  }

  const updateFormData = (section: keyof FormData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetForm = () => {
    setCurrentStep(0)
    setFormData(initialFormData)
    setShowResults(false)
  }

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  if (showResults) {
    const footprint = calculateCarbonFootprint()
    const { level, color, bg, message } = getFootprintLevel(footprint)

    return (
      <div className=" w-screen bg-gradient-to-br from-[#3c3c84] via-[#234097] to-[#623272] relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#a2c4e2]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#993c65]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2f86c8]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto">
          {/* Header - Más compacto */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-400 animate-spin-slow" />
                <Sparkles className="h-4 w-4 text-[#dad6d9] absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#a2c4e2] via-[#2f86c8] to-[#993c65] bg-clip-text text-transparent">
                ALFACTO VERDE
              </h1>
            </div>
            <p className="text-sm text-[#dad6d9] font-light">tu huella cuenta ✨</p>
          </div>

          {/* Results Card - Optimizado para caber en pantalla */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl overflow-hidden">
            <CardHeader className="text-center py-2 px-4">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center shadow-2xl`}>
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-[#2f86c8] to-[#623272] rounded-full blur opacity-30 animate-pulse"></div>
                </div>
              </div>
              <CardTitle className="text-xl text-white">¡Resultados Calculados!</CardTitle>
              <CardDescription className="text-[#dad6d9] text-sm">{message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 py-2">
              {/* Main Result - Más compacto */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#993c65] to-[#3e4e9b] rounded-xl blur opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                    <div className="text-4xl font-bold text-white">{footprint.toFixed(1)}</div>
                    <div className="text-sm text-[#dad6d9] mb-2">toneladas CO₂ / año</div>
                    <div className={`text-base font-semibold ${color} bg-white/20 rounded-full px-4 py-1 inline-block`}>
                      {level}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations - Grid optimizado */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
                <h3 className="font-bold text-white text-base mb-2 flex items-center gap-1.5">
                  <TreePine className="h-4 w-4 text-[#a2c4e2]" />
                  Recomendaciones para un futuro más verde
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-1.5 p-2 bg-white/5 rounded-lg border border-white/10">
                    <Car className="h-3.5 w-3.5 text-[#2f86c8] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white text-xs font-medium">Movilidad Sostenible</div>
                      <div className="text-[#dad6d9] text-xs">Transporte público o bicicleta</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 p-2 bg-white/5 rounded-lg border border-white/10">
                    <Utensils className="h-3.5 w-3.5 text-[#993c65] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white text-xs font-medium">Alimentación Consciente</div>
                      <div className="text-[#dad6d9] text-xs">Vegetales locales, menos desperdicio</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 p-2 bg-white/5 rounded-lg border border-white/10">
                    <Home className="h-3.5 w-3.5 text-[#623272] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white text-xs font-medium">Hogar Eficiente</div>
                      <div className="text-[#dad6d9] text-xs">Energías renovables, eficiencia</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 p-2 bg-white/5 rounded-lg border border-white/10">
                    <Trash2 className="h-3.5 w-3.5 text-[#3c3c84] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white text-xs font-medium">Gestión de Residuos</div>
                      <div className="text-[#dad6d9] text-xs">Recicla, reutiliza, composta</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={resetForm}
                className="w-full bg-gradient-to-r from-[#234097] to-[#993c65] hover:from-[#234097]/90 hover:to-[#993c65]/90 text-white font-semibold py-2 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Calcular de nuevo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#3c3c84] via-[#234097] to-[#623272] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#a2c4e2]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#993c65]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2f86c8]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="relative">
              <Leaf className="h-7 w-7 text-green-400 animate-bounce" />
              <Sparkles className="h-3.5 w-3.5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#a2c4e2] via-[#2f86c8] to-[#993c65] bg-clip-text text-transparent">
              ALFACTO VERDE
            </h1>
          </div>
          <p className="text-xs text-[#dad6d9] font-light">tu huella cuenta ✨</p>
        </div>

        {/* Progress and Steps Navigation */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex-1 mr-3">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-[#dad6d9] text-xs">
                Paso {currentStep + 1}/{steps.length}
              </span>
              <span className="text-[#dad6d9] text-xs">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="relative">
              <Progress
                value={((currentStep + 1) / steps.length) * 100}
                className="h-1.5 bg-white/10 border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f86c8] via-[#993c65] to-[#623272] rounded-full blur opacity-30"></div>
            </div>
          </div>
          <div className="flex gap-1">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className={`relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? `bg-gradient-to-r ${step.color} shadow-lg scale-110`
                      : index < currentStep
                        ? `bg-[${step.accentColor}]/50`
                        : "bg-white/10"
                  }`}
                >
                  <Icon className={`h-3 w-3 ${index <= currentStep ? "text-white" : "text-gray-400"}`} />
                  {index === currentStep && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full blur opacity-50 animate-pulse`}
                    ></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl overflow-hidden">
          <CardHeader className="text-center py-2 px-4">
            <div className="flex justify-center mb-1">
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center shadow-lg`}
                >
                  <StepIcon className="h-5 w-5 text-white" />
                </div>
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${currentStepData.color} rounded-full blur opacity-30 animate-pulse`}
                ></div>
              </div>
            </div>
            <CardTitle className="text-lg text-white">{currentStepData.title}</CardTitle>
            <CardDescription className="text-[#dad6d9] text-xs">{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 py-2 min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3 }}
                >

            {/* Transport Step */}
            {currentStep === 0 && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Cuántos kilómetros manejas por semana?</Label>
                  <Input
                    type="number"
                    placeholder="Ej: 100"
                    value={formData.transport.carUsage}
                    onChange={(e) => updateFormData("transport", "carUsage", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-xl h-8 text-xs focus:border-[#2f86c8] focus:ring-[#2f86c8]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Qué tipo de vehículo usas?</Label>
                  <RadioGroup
                    value={formData.transport.carType}
                    onValueChange={(value) => updateFormData("transport", "carType", value)}
                    className="grid grid-cols-3 gap-1.5"
                  >
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#2f86c8]/10 hover:border-[#2f86c8]/30 transition-all">
                      <RadioGroupItem
                        value="gasoline"
                        id="gasoline"
                        className="border-white/30 text-[#2f86c8] h-3 w-3"
                      />
                      <Label htmlFor="gasoline" className="text-white text-xs cursor-pointer">
                        Gasolina
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#a2c4e2]/10 hover:border-[#a2c4e2]/30 transition-all">
                      <RadioGroupItem value="hybrid" id="hybrid" className="border-white/30 text-[#a2c4e2] h-3 w-3" />
                      <Label htmlFor="hybrid" className="text-white text-xs cursor-pointer">
                        Híbrido
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#2f86c8]/10 hover:border-[#2f86c8]/30 transition-all">
                      <RadioGroupItem
                        value="electric"
                        id="electric"
                        className="border-white/30 text-[#2f86c8] h-3 w-3"
                      />
                      <Label htmlFor="electric" className="text-white text-xs cursor-pointer">
                        Eléctrico
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Cuántos vuelos tomas al año?</Label>
                  <Input
                    type="number"
                    placeholder="Ej: 2"
                    value={formData.transport.flights}
                    onChange={(e) => updateFormData("transport", "flights", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-xl h-8 text-xs focus:border-[#2f86c8] focus:ring-[#2f86c8]"
                  />
                </div>
              </div>
            )}

            {/* Home Step */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Cuál es tu consumo eléctrico mensual? (kWh)</Label>
                  <Input
                    type="number"
                    placeholder="Ej: 300"
                    value={formData.home.electricity}
                    onChange={(e) => updateFormData("home", "electricity", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-xl h-8 text-xs focus:border-[#993c65] focus:ring-[#993c65]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Qué tamaño tiene tu hogar?</Label>
                  <RadioGroup
                    value={formData.home.houseSize}
                    onValueChange={(value) => updateFormData("home", "houseSize", value)}
                    className="grid grid-cols-3 gap-1.5"
                  >
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#993c65]/10 hover:border-[#993c65]/30 transition-all">
                      <RadioGroupItem value="small" id="small" className="border-white/30 text-[#993c65] h-3 w-3" />
                      <Label htmlFor="small" className="text-white text-xs cursor-pointer">
                        Pequeño
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#dad6d9]/10 hover:border-[#dad6d9]/30 transition-all">
                      <RadioGroupItem value="medium" id="medium" className="border-white/30 text-[#dad6d9] h-3 w-3" />
                      <Label htmlFor="medium" className="text-white text-xs cursor-pointer">
                        Mediano
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#993c65]/10 hover:border-[#993c65]/30 transition-all">
                      <RadioGroupItem value="large" id="large" className="border-white/30 text-[#993c65] h-3 w-3" />
                      <Label htmlFor="large" className="text-white text-xs cursor-pointer">
                        Grande
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Cuántas personas viven en tu hogar?</Label>
                  <Input
                    type="number"
                    placeholder="Ej: 3"
                    value={formData.home.people}
                    onChange={(e) => updateFormData("home", "people", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-xl h-8 text-xs focus:border-[#993c65] focus:ring-[#993c65]"
                  />
                </div>
              </div>
            )}

            {/* Food Step */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Cuál describe mejor tu dieta?</Label>
                  <RadioGroup
                    value={formData.food.diet}
                    onValueChange={(value) => updateFormData("food", "diet", value)}
                    className="grid grid-cols-3 gap-1.5"
                  >
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#623272]/10 hover:border-[#623272]/30 transition-all">
                      <RadioGroupItem value="meat" id="meat" className="border-white/30 text-[#623272] h-3 w-3" />
                      <Label htmlFor="meat" className="text-white text-xs cursor-pointer">
                        Con carne
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#3e4e9b]/10 hover:border-[#3e4e9b]/30 transition-all">
                      <RadioGroupItem
                        value="vegetarian"
                        id="vegetarian"
                        className="border-white/30 text-[#3e4e9b] h-3 w-3"
                      />
                      <Label htmlFor="vegetarian" className="text-white text-xs cursor-pointer">
                        Vegetariano
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#623272]/10 hover:border-[#623272]/30 transition-all">
                      <RadioGroupItem value="vegan" id="vegan" className="border-white/30 text-[#623272] h-3 w-3" />
                      <Label htmlFor="vegan" className="text-white text-xs cursor-pointer">
                        Vegano
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Compras alimentos locales/orgánicos?</Label>
                  <RadioGroup
                    value={formData.food.localFood}
                    onValueChange={(value) => updateFormData("food", "localFood", value)}
                    className="grid grid-cols-3 gap-1.5"
                  >
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#623272]/10 hover:border-[#623272]/30 transition-all">
                      <RadioGroupItem
                        value="always"
                        id="always-local"
                        className="border-white/30 text-[#623272] h-3 w-3"
                      />
                      <Label htmlFor="always-local" className="text-white text-xs cursor-pointer">
                        Siempre
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#3e4e9b]/10 hover:border-[#3e4e9b]/30 transition-all">
                      <RadioGroupItem
                        value="sometimes"
                        id="sometimes-local"
                        className="border-white/30 text-[#3e4e9b] h-3 w-3"
                      />
                      <Label htmlFor="sometimes-local" className="text-white text-xs cursor-pointer">
                        A veces
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#623272]/10 hover:border-[#623272]/30 transition-all">
                      <RadioGroupItem
                        value="never"
                        id="never-local"
                        className="border-white/30 text-[#623272] h-3 w-3"
                      />
                      <Label htmlFor="never-local" className="text-white text-xs cursor-pointer">
                        Nunca
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Consumption Step */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Cómo describirías tus hábitos de compra?</Label>
                  <RadioGroup
                    value={formData.consumption.shopping}
                    onValueChange={(value) => updateFormData("consumption", "shopping", value)}
                    className="grid grid-cols-1 gap-1.5"
                  >
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#234097]/10 hover:border-[#234097]/30 transition-all">
                      <RadioGroupItem
                        value="low"
                        id="low-shopping"
                        className="border-white/30 text-[#234097] h-3 w-3"
                      />
                      <Label htmlFor="low-shopping" className="text-white text-xs cursor-pointer">
                        Compro solo lo necesario
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#9e9e9e]/10 hover:border-[#9e9e9e]/30 transition-all">
                      <RadioGroupItem
                        value="medium"
                        id="medium-shopping"
                        className="border-white/30 text-[#9e9e9e] h-3 w-3"
                      />
                      <Label htmlFor="medium-shopping" className="text-white text-xs cursor-pointer">
                        Compro moderadamente
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#234097]/10 hover:border-[#234097]/30 transition-all">
                      <RadioGroupItem
                        value="high"
                        id="high-shopping"
                        className="border-white/30 text-[#234097] h-3 w-3"
                      />
                      <Label htmlFor="high-shopping" className="text-white text-xs cursor-pointer">
                        Compro frecuentemente
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Con qué frecuencia cambias dispositivos electrónicos?</Label>
                  <RadioGroup
                    value={formData.consumption.electronics}
                    onValueChange={(value) => updateFormData("consumption", "electronics", value)}
                    className="grid grid-cols-3 gap-1.5"
                  >
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#234097]/10 hover:border-[#234097]/30 transition-all">
                      <RadioGroupItem
                        value="rarely"
                        id="rarely-electronics"
                        className="border-white/30 text-[#234097] h-3 w-3"
                      />
                      <Label htmlFor="rarely-electronics" className="text-white text-xs cursor-pointer">
                        Cada 4+ años
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#9e9e9e]/10 hover:border-[#9e9e9e]/30 transition-all">
                      <RadioGroupItem
                        value="sometimes"
                        id="sometimes-electronics"
                        className="border-white/30 text-[#9e9e9e] h-3 w-3"
                      />
                      <Label htmlFor="sometimes-electronics" className="text-white text-xs cursor-pointer">
                        Cada 2-3 años
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#234097]/10 hover:border-[#234097]/30 transition-all">
                      <RadioGroupItem
                        value="often"
                        id="often-electronics"
                        className="border-white/30 text-[#234097] h-3 w-3"
                      />
                      <Label htmlFor="often-electronics" className="text-white text-xs cursor-pointer">
                        Cada año
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Waste Step */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Reciclas tus residuos?</Label>
                  <RadioGroup
                    value={formData.waste.recycling}
                    onValueChange={(value) => updateFormData("waste", "recycling", value)}
                    className="grid grid-cols-3 gap-1.5"
                  >
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#3c3c84]/10 hover:border-[#3c3c84]/30 transition-all">
                      <RadioGroupItem
                        value="always"
                        id="always-recycle"
                        className="border-white/30 text-[#3c3c84] h-3 w-3"
                      />
                      <Label htmlFor="always-recycle" className="text-white text-xs cursor-pointer">
                        Siempre
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#5d5d5d]/10 hover:border-[#5d5d5d]/30 transition-all">
                      <RadioGroupItem
                        value="sometimes"
                        id="sometimes-recycle"
                        className="border-white/30 text-[#5d5d5d] h-3 w-3"
                      />
                      <Label htmlFor="sometimes-recycle" className="text-white text-xs cursor-pointer">
                        A veces
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#3c3c84]/10 hover:border-[#3c3c84]/30 transition-all">
                      <RadioGroupItem
                        value="never"
                        id="never-recycle"
                        className="border-white/30 text-[#3c3c84] h-3 w-3"
                      />
                      <Label htmlFor="never-recycle" className="text-white text-xs cursor-pointer">
                        Nunca
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1">
                  <Label className="text-white text-xs">¿Haces compostaje?</Label>
                  <RadioGroup
                    value={formData.waste.composting}
                    onValueChange={(value) => updateFormData("waste", "composting", value)}
                    className="grid grid-cols-2 gap-1.5"
                  >
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#3c3c84]/10 hover:border-[#3c3c84]/30 transition-all">
                      <RadioGroupItem value="yes" id="yes-compost" className="border-white/30 text-[#3c3c84] h-3 w-3" />
                      <Label htmlFor="yes-compost" className="text-white text-xs cursor-pointer">
                        Sí
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 hover:bg-[#5d5d5d]/10 hover:border-[#5d5d5d]/30 transition-all">
                      <RadioGroupItem value="no" id="no-compost" className="border-white/30 text-[#5d5d5d] h-3 w-3" />
                      <Label htmlFor="no-compost" className="text-white text-xs cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
            </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between pt-1">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1 bg-white/10 border-white/20 text-white hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/30 disabled:opacity-50 px-2 py-0.5 text-xs h-7"
              >
                <ChevronLeft className="h-3 w-3" />
                Anterior
              </Button>

              <Button
                onClick={nextStep}
                className="flex items-center gap-1 bg-gradient-to-r from-[#234097] to-[#993c65] hover:from-[#234097]/90 hover:to-[#993c65]/90 text-white px-2 py-0.5 text-xs h-7 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {currentStep === steps.length - 1 ? "Calcular" : "Siguiente"}
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
